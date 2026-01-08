// constants/colors.js
const bobaThemeLight = {
  primary: "#667132",
  background: "#FFF8F3",
  text: "#021B3D",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  pb: "#EFBF04",
  silver: "#8f8f8fff",
  bronze: "#CD7F32",
  other: "#444444ff",
  card: "#FFFFFF",
  shadow: "#000000",
  yellow: "#D6AC46",
  theme: "light",
  dateTheme: "dark",
};

const bobaThemeDark = {
  primary: "#667132",
  background: "#021B3D",
  text: "#e2e2e2ff",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#c2b9b5ff",
  expense: "#E74C3C",
  income: "#2ECC71",
  pb: "#EFBF04",
  silver: "#8f8f8fff",
  bronze: "#CD7F32",
  other: "#cececeff",
  card: "#011025ff",
  shadow: "#000000",
  yellow: "#D6AC46",
  theme: "dark",
  dateTheme: "light",
}

export const THEMES = {
  boba: bobaThemeLight
};

// 👇 change this to switch theme
export const COLORS = THEMES.boba;