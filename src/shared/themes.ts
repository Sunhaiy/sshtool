export type ThemeId = 'light' | 'dark' | 'cyberpunk' | 'taxuexunmei' | 'pixel';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface TerminalTheme {
  background: string;
  foreground: string;
  cursor: string;
  selectionBackground: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  type: 'light' | 'dark';
  colors: ThemeColors;
  terminal: TerminalTheme;
  fontFamily: string;
}

export const themes: Record<ThemeId, Theme> = {
  light: {
    id: 'light',
    name: 'Light Day',
    type: 'light',
    fontFamily: "'Inter', sans-serif",
    colors: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      popover: "0 0% 100%",
      popoverForeground: "222.2 84% 4.9%",
      primary: "222.2 47.4% 11.2%",
      primaryForeground: "210 40% 98%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      accent: "210 40% 96.1%",
      accentForeground: "222.2 47.4% 11.2%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",
      border: "214.3 31.8% 91.4%",
      input: "214.3 31.8% 91.4%",
      ring: "222.2 84% 4.9%",
    },
    terminal: {
      background: '#ffffff',
      foreground: '#000000',
      cursor: '#000000',
      selectionBackground: '#b3d7ff',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#ffffff',
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark Night',
    type: 'dark',
    fontFamily: "'Inter', sans-serif",
    colors: {
      background: "222.2 84% 4.9%",
      foreground: "210 40% 98%",
      card: "222.2 84% 4.9%",
      cardForeground: "210 40% 98%",
      popover: "222.2 84% 4.9%",
      popoverForeground: "210 40% 98%",
      primary: "210 40% 98%",
      primaryForeground: "222.2 47.4% 11.2%",
      secondary: "217.2 32.6% 17.5%",
      secondaryForeground: "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      mutedForeground: "215 20.2% 65.1%",
      accent: "217.2 32.6% 17.5%",
      accentForeground: "210 40% 98%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "210 40% 98%",
      border: "217.2 32.6% 17.5%",
      input: "217.2 32.6% 17.5%",
      ring: "212.7 26.8% 83.9%",
    },
    terminal: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#ffffff',
      selectionBackground: '#264f78',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#ffffff',
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    type: 'dark',
    fontFamily: "'Courier New', monospace",
    colors: {
      background: "260 50% 10%", // Dark purple-ish
      foreground: "60 100% 50%", // Yellow text
      card: "260 50% 12%",
      cardForeground: "60 100% 50%",
      popover: "260 50% 12%",
      popoverForeground: "60 100% 50%",
      primary: "320 100% 50%", // Neon Pink
      primaryForeground: "0 0% 100%",
      secondary: "180 100% 50%", // Cyan
      secondaryForeground: "0 0% 0%",
      muted: "260 30% 20%",
      mutedForeground: "180 80% 50%", // Cyan dimmed
      accent: "320 100% 50%",
      accentForeground: "0 0% 100%",
      destructive: "0 100% 50%",
      destructiveForeground: "0 0% 100%",
      border: "180 100% 50%", // Cyan borders
      input: "260 30% 20%",
      ring: "320 100% 50%",
    },
    terminal: {
      background: '#0d0221', // Deep purple
      foreground: '#00ff41', // Matrix green
      cursor: '#fcee0a', // Cyber yellow
      selectionBackground: '#ff003c', // Cyber red
      black: '#000000',
      red: '#ff003c',
      green: '#00ff41',
      yellow: '#fcee0a',
      blue: '#00e0ff', // Cyber cyan
      magenta: '#ff00ff', // Neon pink
      cyan: '#00ffff',
      white: '#ffffff',
      brightBlack: '#676767',
      brightRed: '#ff5c81',
      brightGreen: '#5cff86',
      brightYellow: '#fdf56f',
      brightBlue: '#65ebff',
      brightMagenta: '#ff66ff',
      brightCyan: '#66ffff',
      brightWhite: '#ffffff',
    }
  },
  taxuexunmei: {
    id: 'taxuexunmei',
    name: 'Plum Blossom',
    type: 'light',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    colors: {
      background: "0 0% 98%", // Snow white
      foreground: "0 0% 20%", // Dark grey
      card: "0 0% 100%",
      cardForeground: "0 0% 20%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 20%",
      primary: "350 80% 40%", // Plum Red
      primaryForeground: "0 0% 100%",
      secondary: "350 30% 90%", // Light pink
      secondaryForeground: "350 80% 40%",
      muted: "0 0% 90%",
      mutedForeground: "0 0% 40%",
      accent: "350 30% 90%",
      accentForeground: "350 80% 40%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 90%",
      input: "0 0% 95%",
      ring: "350 80% 40%",
    },
    terminal: {
      background: '#fffafa', // Snow
      foreground: '#4a4a4a',
      cursor: '#c71585', // MediumVioletRed
      selectionBackground: '#ffb6c1', // LightPink
      black: '#000000',
      red: '#b22222', // FireBrick
      green: '#228b22', // ForestGreen
      yellow: '#daa520', // GoldenRod
      blue: '#4682b4', // SteelBlue
      magenta: '#c71585', // MediumVioletRed
      cyan: '#20b2aa', // LightSeaGreen
      white: '#dcdcdc',
      brightBlack: '#808080',
      brightRed: '#cd5c5c',
      brightGreen: '#32cd32',
      brightYellow: '#ffd700',
      brightBlue: '#87ceeb',
      brightMagenta: '#ff69b4',
      brightCyan: '#40e0d0',
      brightWhite: '#ffffff',
    }
  },
  pixel: {
    id: 'pixel',
    name: 'Retro Pixel',
    type: 'dark',
    fontFamily: "'Courier New', monospace",
    colors: {
      background: "0 0% 0%", // Pure black
      foreground: "120 100% 50%", // Terminal Green
      card: "0 0% 5%",
      cardForeground: "120 100% 50%",
      popover: "0 0% 5%",
      popoverForeground: "120 100% 50%",
      primary: "120 100% 50%",
      primaryForeground: "0 0% 0%",
      secondary: "0 0% 20%",
      secondaryForeground: "120 100% 50%",
      muted: "0 0% 20%",
      mutedForeground: "120 60% 40%",
      accent: "120 100% 50%",
      accentForeground: "0 0% 0%",
      destructive: "0 100% 50%",
      destructiveForeground: "0 0% 100%",
      border: "120 100% 50%",
      input: "0 0% 10%",
      ring: "120 100% 50%",
    },
    terminal: {
      background: '#000000',
      foreground: '#00ff00',
      cursor: '#00ff00',
      selectionBackground: '#003300',
      black: '#000000',
      red: '#ff0000',
      green: '#00ff00',
      yellow: '#ffff00',
      blue: '#0000ff',
      magenta: '#ff00ff',
      cyan: '#00ffff',
      white: '#ffffff',
      brightBlack: '#333333',
      brightRed: '#ff3333',
      brightGreen: '#33ff33',
      brightYellow: '#ffff33',
      brightBlue: '#3333ff',
      brightMagenta: '#ff33ff',
      brightCyan: '#33ffff',
      brightWhite: '#ffffff',
    }
  }
};
