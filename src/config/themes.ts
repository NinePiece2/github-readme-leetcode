import { RawTheme, Theme } from '../types/leetcode';

// A friendly list of themes. Colors stored without '#' for backward compatibility with the
// github-readme-stats-style themes. Add more themes here as desired.
export const rawThemes: { [key: string]: RawTheme } = {
  default: { 
    title_color: "2f80ed", 
    icon_color: "4c71f2", 
    text_color: "434d58", 
    bg_color: "fffefe", 
    border_color: "e4e2e2",
    accent_color: "ff6b6b"
  },
  dark: { 
    title_color: "fff", 
    icon_color: "79ff97", 
    text_color: "9f9f9f", 
    bg_color: "151515",
    border_color: "e4e2e2",
    accent_color: "79ff97"
  },
  radical: {
    title_color: "fe428e",
    icon_color: "a9fef7", 
    text_color: "a9fef7",
    bg_color: "141321",
    border_color: "141321",
    accent_color: "fe428e"
  },
  merko: {
    title_color: "abd200",
    icon_color: "b7d364",
    text_color: "68b587", 
    bg_color: "0a0f0b",
    border_color: "0a0f0b",
    accent_color: "abd200"
  },
  gruvbox: {
    title_color: "fabd2f",
    icon_color: "fe8019",
    text_color: "8ec07c",
    bg_color: "282828",
    border_color: "282828",
    accent_color: "fabd2f"
  },
  tokyonight: {
    title_color: "70a5fd",
    icon_color: "bf91f3",
    text_color: "38bdae",
    bg_color: "1a1b27",
    border_color: "1a1b27",
    accent_color: "70a5fd"
  },
  onedark: {
    title_color: "e06c75",
    icon_color: "61afef",
    text_color: "abb2bf",
    bg_color: "282c34",
    border_color: "282c34",
    accent_color: "e06c75"
  },
  cobalt: {
    title_color: "e683d9",
    icon_color: "0480ef",
    text_color: "75eeb2",
    bg_color: "193549",
    border_color: "193549",
    accent_color: "e683d9"
  },
  synthwave: {
    title_color: "e2e9ec",
    icon_color: "ef8539",
    text_color: "e5289e",
    bg_color: "2d1b69",
    border_color: "2d1b69",
    accent_color: "ef8539"
  },
  highcontrast: {
    title_color: "e7f216",
    icon_color: "00ffff",
    text_color: "fff",
    bg_color: "000",
    border_color: "fff",
    accent_color: "e7f216"
  },
  dracula: {
    title_color: "ff6bcb",
    icon_color: "8be9fd",
    text_color: "f8f8f2",
    bg_color: "282a36",
    border_color: "282a36",
    accent_color: "ff6bcb"
  },
  prussian: {
    title_color: "bddfff",
    icon_color: "38a0ff",
    text_color: "6e9ecf",
    bg_color: "172f45",
    border_color: "172f45",
    accent_color: "bddfff"
  },
  monokai: {
    title_color: "eb1f6a",
    icon_color: "e28905",
    text_color: "f1f1f1",
    bg_color: "272822",
    border_color: "272822",
    accent_color: "eb1f6a"
  },
  vue: {
    title_color: "41b883",
    icon_color: "41b883",
    text_color: "273849",
    bg_color: "fffefe",
    border_color: "e4e2e2",
    accent_color: "41b883"
  },
  "vue-dark": {
    title_color: "41b883",
    icon_color: "41b883",
    text_color: "abb2bf",
    bg_color: "273849",
    border_color: "273849",
    accent_color: "41b883"
  },
  "shades-of-purple": {
    title_color: "fad000",
    icon_color: "b362ff",
    text_color: "a599e9",
    bg_color: "2d2b55",
    border_color: "2d2b55",
    accent_color: "fad000"
  },
  nightowl: {
    title_color: "c792ea",
    icon_color: "ffeb95",
    text_color: "7fdbca",
    bg_color: "011627",
    border_color: "011627",
    accent_color: "c792ea"
  },
  buefy: {
    title_color: "7957d5",
    icon_color: "ff3860",
    text_color: "363636",
    bg_color: "ffffff",
    border_color: "e4e2e2",
    accent_color: "7957d5"
  },
  "blue-green": {
    title_color: "2f97c1",
    icon_color: "f5b700",
    text_color: "0cf574",
    bg_color: "040f0f",
    border_color: "040f0f",
    accent_color: "2f97c1"
  },
  algolia: {
    title_color: "00aeff",
    icon_color: "3d5eff",
    text_color: "ffffff",
    bg_color: "050f2c",
    border_color: "050f2c",
    accent_color: "00aeff"
  },
  "great-gatsby": {
    title_color: "ffa726",
    icon_color: "ffb74d",
    text_color: "ffd95a",
    bg_color: "000000",
    border_color: "000000",
    accent_color: "ffa726"
  },
  darcula: {
    title_color: "BA5F17",
    icon_color: "84628F",
    text_color: "BEBEBE",
    bg_color: "242424",
    border_color: "242424",
    accent_color: "BA5F17"
  },
  bear: {
    title_color: "e03c8a",
    icon_color: "00AEFF",
    text_color: "bcb28d",
    bg_color: "1f2023",
    border_color: "1f2023",
    accent_color: "e03c8a"
  },
  "solarized-dark": {
    title_color: "268bd2",
    icon_color: "b58900",
    text_color: "839496",
    bg_color: "002b36",
    border_color: "002b36",
    accent_color: "268bd2"
  },
  "solarized-light": {
    title_color: "268bd2",
    icon_color: "b58900",
    text_color: "586e75",
    bg_color: "fdf6e3",
    border_color: "eee8d5",
    accent_color: "268bd2"
  },
  "chartreuse-dark": {
    title_color: "7fff00",
    icon_color: "00AEFF",
    text_color: "fff",
    bg_color: "000",
    border_color: "fff",
    accent_color: "7fff00"
  },
  nord: {
    title_color: "81a1c1",
    icon_color: "88c0d0",
    text_color: "d8dee9",
    bg_color: "2e3440",
    border_color: "2e3440",
    accent_color: "81a1c1"
  },
  gotham: {
    title_color: "2aa889",
    icon_color: "599cab",
    text_color: "99d1ce",
    bg_color: "0c1014",
    border_color: "0c1014",
    accent_color: "2aa889"
  },
  "material-palenight": {
    title_color: "c792ea",
    icon_color: "89ddff",
    text_color: "a6accd",
    bg_color: "292d3e",
    border_color: "292d3e",
    accent_color: "c792ea"
  },
  graywhite: {
    title_color: "24292e",
    icon_color: "24292e",
    text_color: "24292e",
    bg_color: "ffffff",
    border_color: "e1e4e8",
    accent_color: "0366d6"
  },
  "vision-friendly-dark": {
    title_color: "ffb000",
    icon_color: "785ef0",
    text_color: "ffffff",
    bg_color: "000000",
    border_color: "ffb000",
    accent_color: "ffb000"
  },
  "ayu-mirage": {
    title_color: "f4cd7c",
    icon_color: "73d0ff",
    text_color: "c7c8c2",
    bg_color: "1f2430",
    border_color: "1f2430",
    accent_color: "f4cd7c"
  },
  "midnight-purple": {
    title_color: "9745f5",
    icon_color: "9f4bff",
    text_color: "ffffff",
    bg_color: "000000",
    border_color: "9745f5",
    accent_color: "9745f5"
  },
  calm: {
    title_color: "e07a5f",
    icon_color: "edae49",
    text_color: "ebcb8b",
    bg_color: "373f51",
    border_color: "373f51",
    accent_color: "e07a5f"
  },
  "flag-india": {
    title_color: "ff8f1c",
    icon_color: "250654",
    text_color: "509E2F",
    bg_color: "ffffff",
    border_color: "e4e2e2",
    accent_color: "ff8f1c"
  },
  omni: {
    title_color: "FF79C6",
    icon_color: "e7de79",
    text_color: "F8F8F2",
    bg_color: "191622",
    border_color: "191622",
    accent_color: "FF79C6"
  },
  react: {
    title_color: "61dafb",
    icon_color: "61dafb",
    text_color: "ffffff",
    bg_color: "20232a",
    border_color: "20232a",
    accent_color: "61dafb"
  },
  jolly: {
    title_color: "ff64da",
    icon_color: "a960ff",
    text_color: "ffffff",
    bg_color: "291B3E",
    border_color: "291B3E",
    accent_color: "ff64da"
  },
  maroongold: {
    title_color: "F7EF8A",
    icon_color: "F7EF8A",
    text_color: "E6DDC4",
    bg_color: "0e1116",
    border_color: "0e1116",
    accent_color: "F7EF8A"
  },
  yeblu: {
    title_color: "ffff00",
    icon_color: "ffff00",
    text_color: "ffffff",
    bg_color: "002046",
    border_color: "002046",
    accent_color: "ffff00"
  },
  blueberry: {
    title_color: "82aaff",
    icon_color: "89ddff",
    text_color: "27e8a7",
    bg_color: "242938",
    border_color: "242938",
    accent_color: "82aaff"
  },
  slateorange: {
    title_color: "faa627",
    icon_color: "faa627",
    text_color: "ffffff",
    bg_color: "36393f",
    border_color: "36393f",
    accent_color: "faa627"
  },
  kacho_ga: {
    title_color: "bf4a3f",
    icon_color: "a64833",
    text_color: "d9c8a9",
    bg_color: "402b23",
    border_color: "402b23",
    accent_color: "bf4a3f"
  }
};

/**
 * Normalizes a theme by converting raw theme colors to proper Theme format
 * @param themeName - The name of the theme to get
 * @returns Normalized Theme object
 */
export function getTheme(themeName: string): Theme {
  const theme = rawThemes[themeName] || rawThemes.default;
  
  const normalize = (color?: string) => color?.replace('#', '') || '';
  
  return {
    titleColor: normalize(theme.title_color) || "2f80ed",
    iconColor: normalize(theme.icon_color) || "4c71f2", 
    textColor: normalize(theme.text_color) || "434d58",
    bgColor: normalize(theme.bg_color) || "fffefe",
    borderColor: normalize(theme.border_color) || "e4e2e2",
    accentColor: normalize(theme.accent_color) || "ff6b6b"
  };
}

/**
 * Gets list of all available theme names
 * @returns Array of theme names
 */
export function getAvailableThemes(): string[] {
  return Object.keys(rawThemes);
}

/**
 * Checks if a theme exists
 * @param themeName - Theme name to check
 * @returns True if theme exists
 */
export function isValidTheme(themeName: string): boolean {
  return themeName in rawThemes;
}