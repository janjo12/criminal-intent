require("react-native-gesture-handler/jestSetup");

jest.mock("@react-native-async-storage/async-storage", () => {
  let store = {};

  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null)),
      setItem: jest.fn(async (key, value) => {
        store[key] = String(value);
      }),
      removeItem: jest.fn(async (key) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
      getAllKeys: jest.fn(async () => Object.keys(store)),
      multiGet: jest.fn(async (keys) => keys.map((key) => [key, store[key] ?? null])),
      multiSet: jest.fn(async (pairs) => {
        pairs.forEach(([key, value]) => {
          store[key] = String(value);
        });
      }),
    },
  };
});

jest.mock("expo-image-picker", () => ({
  MediaTypeOptions: {
    Images: "Images",
  },
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    assets: [{ uri: "file:///selected-evidence-photo.jpg" }],
  })),
}));

jest.mock("expo-symbols", () => ({
  SymbolView: "SymbolView",
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    MaterialCommunityIcons: ({ name, ...props }) => React.createElement(Text, props, name),
  };
});

globalThis.__TEST_NOW__ = "2026-05-27T05:00:00.000Z";
