export type Crime = {
  id: string;
  title: string;
  details: string;
  date: string;
  solved: boolean;
  photoUri?: string | null;
};

export type AppSettings = {
  darkMode: boolean;
  dateFormat: "medium" | "iso";
};
