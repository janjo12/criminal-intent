import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { fireEvent, renderRouter, screen, testRouter, waitFor } from "expo-router/testing-library";
import fs from "fs";
import path from "path";
import { Alert } from "react-native";

const repoRoot = path.resolve(__dirname, "..");
const CRIMES_KEY = "criminal-intent:crimes";
const SETTINGS_KEY = "criminal-intent:settings";

const crimes = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Stolen Bicycle",
    details: "Missing from the east rack.",
    date: "2026-05-20T12:00:00.000Z",
    solved: false,
    photoUri: null,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Library Vandalism",
    details: "Graffiti near the stacks.",
    date: "2026-05-22T12:00:00.000Z",
    solved: true,
    photoUri: "file:///stored-photo.jpg",
  },
];

async function seedStorage({
  storedCrimes = crimes,
  settings = { darkMode: false, dateFormat: "medium" },
} = {}) {
  await AsyncStorage.clear();
  await AsyncStorage.setItem(CRIMES_KEY, JSON.stringify(storedCrimes));
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function routeFile(relativePath: string) {
  return path.join(repoRoot, relativePath);
}

describe("route and architecture requirements", () => {
  it("defines the required Expo Router screens", () => {
    expect(fs.existsSync(routeFile("src/app/index.tsx"))).toBe(true);
    expect(fs.existsSync(routeFile("src/app/crime/[id].tsx"))).toBe(true);
    expect(fs.existsSync(routeFile("src/app/settings.tsx"))).toBe(true);
  });

  it("keeps crime data out of React Context and passes crimes between screens only by UUID", () => {
    const srcFiles = fs
      .readdirSync(path.join(repoRoot, "src"), { recursive: true })
      .filter((file) => String(file).endsWith(".ts") || String(file).endsWith(".tsx"))
      .map((file) => String(file));

    const source = srcFiles
      .map((file) => fs.readFileSync(path.join(repoRoot, "src", file), "utf8"))
      .join("\n");

    expect(source).not.toMatch(/createContext\s*<[^>]*(Crime|Crimes)|createContext\s*\([^)]*(crime|crimes)/i);
    expect(source).toMatch(/AsyncStorage|expo-sqlite|SQLite|FileSystem|SecureStore/i);

    const indexSource = fs.readFileSync(routeFile("src/app/index.tsx"), "utf8");
    expect(indexSource).toMatch(/FlatList/);
    expect(indexSource).toMatch(/\/crime\/\[id\]|pathname:\s*["']\/crime\/\[id\]["']/);
    expect(indexSource).toMatch(/params:\s*{[^}]*id/i);
    expect(indexSource).not.toMatch(/params:\s*{[^}]*(title|details|date|solved|photoUri)/i);
  });

  it("uses React Context for app settings or theming, but not for crime records", () => {
    const settingsSource = fs
      .readdirSync(routeFile("src"), { recursive: true })
      .filter((file: unknown) => String(file).endsWith(".ts") || String(file).endsWith(".tsx"))
      .map((file: unknown) => fs.readFileSync(routeFile(path.join("src", String(file))), "utf8"))
      .join("\n");

    expect(settingsSource).toMatch(/createContext/);
    expect(settingsSource).toMatch(/settings|colorScheme|darkMode/i);
    expect(settingsSource).not.toMatch(/createContext\s*<[^>]*(Crime|Crimes)|createContext\s*\([^)]*(crime|crimes)/i);
  });

  it("breaks the app into reusable non-route modules", () => {
    expect(fs.existsSync(routeFile("src/components"))).toBe(true);
    expect(fs.existsSync(routeFile("src/context/SettingsContext.tsx"))).toBe(false);
    expect(fs.existsSync(routeFile("src/global.d.ts"))).toBe(false);
    expect(fs.existsSync(routeFile("src/types.ts"))).toBe(false);
    const libDir = routeFile("src/lib");
    const libSourceFiles = fs.existsSync(libDir)
      ? fs.readdirSync(libDir, { recursive: true }).filter((file) => String(file).endsWith(".ts"))
      : [];
    expect(libSourceFiles).toEqual([]);
  });
});

describe("crime storage contract", () => {
  it("stores crimes locally by UUID and loads a single crime by route id", async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem(CRIMES_KEY, JSON.stringify(crimes));

    const app = renderRouter("./src/app", { initialUrl: `/crime/${crimes[1].id}` });

    const raw = await AsyncStorage.getItem(CRIMES_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toEqual(expect.arrayContaining(crimes));
    await waitFor(() => expect(app.getPathname()).toBe(`/crime/${crimes[1].id}`));
    expect(await screen.findByDisplayValue("Library Vandalism")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("Graffiti near the stacks.")).toBeOnTheScreen();
  });

  it("creates new crimes with RFC4122-looking UUIDs instead of array indexes", async () => {
    await seedStorage({ storedCrimes: [] });
    const app = renderRouter("./src/app", { initialUrl: "/" });

    fireEvent.press(await screen.findByLabelText(/add crime/i));

    await waitFor(() => expect(app.getPathname()).toMatch(/^\/crime\/[0-9a-f-]{36}$/i));
    expect(app.getSearchParams().id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    const saved = JSON.parse((await AsyncStorage.getItem(CRIMES_KEY)) as string);
    expect(saved).toEqual([expect.objectContaining({ title: "", details: "", solved: false })]);
  });
});

describe("index screen", () => {
  beforeEach(async () => {
    await seedStorage();
  });

  it("renders crimes with a FlatList and shows a handcuff icon only for solved crimes", async () => {
    renderRouter("./src/app", { initialUrl: "/" });

    expect(await screen.findByTestId("crime-list")).toBeOnTheScreen();
    expect(await screen.findByText("Stolen Bicycle")).toBeOnTheScreen();
    expect(screen.getByText("Library Vandalism")).toBeOnTheScreen();
    expect(screen.getByLabelText(/library vandalism solved handcuff/i)).toBeOnTheScreen();
    expect(screen.queryByLabelText(/stolen bicycle solved handcuff/i)).toBeNull();
  });

  it("shows the plus button on the index screen only and opens an empty detail screen for a new UUID", async () => {
    const app = renderRouter("./src/app", { initialUrl: "/" });

    const addButton = await screen.findByLabelText(/add crime/i);
    fireEvent.press(addButton);

    await waitFor(() => expect(app.getPathname()).toMatch(/^\/crime\/[0-9a-f-]{36}$/i));
    const params = app.getSearchParams();
    expect(params.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(screen.queryByLabelText(/add crime/i)).toBeNull();
    expect(screen.getByLabelText(/crime title/i)).toHaveProp("value", "");
    expect(screen.getByLabelText(/crime details/i)).toHaveProp("value", "");
  });

  it("opens a filled detail screen when a crime row is pressed", async () => {
    const app = renderRouter("./src/app", { initialUrl: "/" });

    fireEvent.press(await screen.findByText("Library Vandalism"));

    await waitFor(() => expect(app.getPathname()).toBe(`/crime/${crimes[1].id}`));
    expect(app.getSearchParams()).toEqual(expect.objectContaining({ id: crimes[1].id }));
    expect(await screen.findByDisplayValue("Library Vandalism")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("Graffiti near the stacks.")).toBeOnTheScreen();
    expect(screen.getByTestId("crime-photo-preview")).toHaveProp("source", { uri: "file:///stored-photo.jpg" });
  });
});

describe("detail screen", () => {
  beforeEach(async () => {
    await seedStorage();
    jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("supports editing title, details, solved state, date, and image picker photo", async () => {
    renderRouter("./src/app", { initialUrl: `/crime/${crimes[0].id}` });

    fireEvent.changeText(await screen.findByLabelText(/crime title/i), "Updated Crime");
    fireEvent.changeText(screen.getByLabelText(/crime details/i), "Updated report details.");
    fireEvent.press(screen.getByLabelText(/mark solved/i));

    fireEvent.press(screen.getByLabelText(/change date/i));
    expect(await screen.findByTestId("crime-date-picker-modal")).toBeOnTheScreen();
    fireEvent.press(screen.getByLabelText(/next month/i));
    fireEvent.press(screen.getByLabelText(/select june 1, 2026/i));
    fireEvent.press(screen.getByText(/ok/i));
    await waitFor(() => expect(screen.getByText(/jun|june|06\/01\/2026|2026-06-01/i)).toBeOnTheScreen());

    fireEvent.press(screen.getByLabelText(/choose photo|camera roll|photo library/i));
    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());
    expect(await screen.findByTestId("crime-photo-preview")).toHaveProp("source", {
      uri: "file:///selected-evidence-photo.jpg",
    });
  });

  it("saves edits to device storage and returns to the index screen", async () => {
    const app = renderRouter("./src/app", { initialUrl: `/crime/${crimes[0].id}` });

    fireEvent.changeText(await screen.findByLabelText(/crime title/i), "Recovered Bicycle");
    fireEvent.changeText(screen.getByLabelText(/crime details/i), "Owner found the bicycle.");
    fireEvent.press(screen.getByLabelText(/mark solved/i));
    fireEvent.press(screen.getByLabelText(/save crime/i));

    await waitFor(() => expect(app.getPathname()).toBe("/"));

    const saved = JSON.parse((await AsyncStorage.getItem(CRIMES_KEY)) as string);
    expect(saved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: crimes[0].id,
          title: "Recovered Bicycle",
          details: "Owner found the bicycle.",
          solved: true,
        }),
      ])
    );
  });

  it("updates the index list after saving a new crime", async () => {
    const app = renderRouter("./src/app", { initialUrl: "/" });
    fireEvent.press(await screen.findByLabelText(/add crime/i));
    await waitFor(() => expect(app.getPathname()).toMatch(/^\/crime\/[0-9a-f-]{36}$/i));

    fireEvent.changeText(await screen.findByLabelText(/crime title/i), "New Evidence Report");
    fireEvent.changeText(screen.getByLabelText(/crime details/i), "Freshly entered report.");
    fireEvent.press(screen.getByLabelText(/save crime/i));

    await waitFor(() => expect(app.getPathname()).toBe("/"));
    expect(await screen.findByText("New Evidence Report")).toBeOnTheScreen();
  });
});

describe("settings screen and app-wide settings", () => {
  beforeEach(async () => {
    await seedStorage();
  });

  it("shows a settings cog on every non-settings screen and hides it on settings", async () => {
    const app = renderRouter("./src/app", { initialUrl: "/" });

    fireEvent.press(await screen.findByLabelText(/settings/i));
    await waitFor(() => expect(app.getPathname()).toBe("/settings"));
    expect(screen.queryByLabelText(/settings/i)).toBeNull();

    testRouter.back("/");
    fireEvent.press(await screen.findByText("Stolen Bicycle"));
    expect(await screen.findByLabelText(/settings/i)).toBeOnTheScreen();
  });

  it("persists a theme setting and applies it to other screens", async () => {
    renderRouter("./src/app", { initialUrl: "/settings" });

    const darkModeSwitch = await screen.findByLabelText(/dark mode/i);
    fireEvent(darkModeSwitch, "valueChange", true);

    await waitFor(async () => {
      const saved = JSON.parse((await AsyncStorage.getItem(SETTINGS_KEY)) as string);
      expect(saved).toEqual(expect.objectContaining({ darkMode: true }));
    });

    testRouter.replace("/");
    expect(await screen.findByTestId("index-screen")).toHaveStyle({ backgroundColor: "#111827" });
    expect(screen.getByTestId("index-screen")).toHaveProp("accessibilityLabel", expect.stringMatching(/dark theme/i));
  });

  it("persists a date format setting and changes the displayed crime dates", async () => {
    renderRouter("./src/app", { initialUrl: "/settings" });

    fireEvent.press(await screen.findByLabelText(/date format/i));
    fireEvent.press(await screen.findByText(/iso/i));

    await waitFor(async () => {
      const saved = JSON.parse((await AsyncStorage.getItem(SETTINGS_KEY)) as string);
      expect(saved).toEqual(expect.objectContaining({ dateFormat: "iso" }));
    });

    testRouter.replace("/");
    expect(await screen.findByText(/2026-05-20/)).toBeOnTheScreen();
  });
});
