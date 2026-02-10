
export type BaseThemeId = 'light' | 'dark' | 'black';
export type AccentColorId = 'green' | 'teal' | 'blue' | 'indigo' | 'purple' | 'yellow' | 'orange' | 'red' | 'pink';

export type TerminalThemeId = 'default' | 'adventureTime' | 'afterglow' | 'alienBlood' | 'argonaut' | 'dracula' | 'githubLight' | 'solarizedDark' | 'monokaiPro' | 'bounds' | 'cyberpunk' | 'taxuexunmei' | 'pixel' | 'zangqing';

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

export interface BaseTheme {
  id: BaseThemeId;
  name: string;
  type: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
  };
}

export interface AccentColor {
  id: AccentColorId;
  name: string;
  color: string; // The main primary color value (HSL)
  foreground: string; // Usually white or black depending on contrast
}

export const baseThemes: Record<BaseThemeId, BaseTheme> = {
  light: {
    id: 'light',
    name: 'Light',
    type: 'light',
    colors: {
      background: "0 0% 100%",        // #ffffff
      foreground: "222.2 84% 4.9%",   // #020817
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      popover: "0 0% 100%",
      popoverForeground: "222.2 84% 4.9%",
      secondary: "210 40% 96.1%",     // #f1f5f9
      secondaryForeground: "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      border: "214.3 31.8% 91.4%",    // #e2e8f0
      input: "214.3 31.8% 91.4%",
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    type: 'dark',
    colors: {
      background: "222.2 84% 4.9%",   // #020817 (Default Slate-ish dark)
      foreground: "210 40% 98%",      // #f8fafc
      card: "222.2 84% 4.9%",
      cardForeground: "210 40% 98%",
      popover: "222.2 84% 4.9%",
      popoverForeground: "210 40% 98%",
      secondary: "217.2 32.6% 17.5%", // #1e293b
      secondaryForeground: "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      mutedForeground: "215 20.2% 65.1%",
      border: "217.2 32.6% 17.5%",
      input: "217.2 32.6% 17.5%",
    }
  },
  black: {
    id: 'black',
    name: 'Black',
    type: 'dark',
    colors: {
      background: "0 0% 0%",          // #000000
      foreground: "0 0% 100%",        // #ffffff
      card: "0 0% 3%",                // #080808
      cardForeground: "0 0% 100%",
      popover: "0 0% 3%",
      popoverForeground: "0 0% 100%",
      secondary: "0 0% 12%",          // #1f1f1f
      secondaryForeground: "0 0% 100%",
      muted: "0 0% 12%",
      mutedForeground: "0 0% 60%",
      border: "0 0% 12%",
      input: "0 0% 12%",
    }
  }
};

export const accentColors: Record<AccentColorId, AccentColor> = {
  green: { id: 'green', name: 'Green', color: "142 71% 45%", foreground: "0 0% 100%" },    // #22c55e
  teal: { id: 'teal', name: 'Teal', color: "173 58% 39%", foreground: "0 0% 100%" },       // #14b8a6
  blue: { id: 'blue', name: 'Blue', color: "221 83% 53%", foreground: "0 0% 100%" },       // #3b82f6
  indigo: { id: 'indigo', name: 'Indigo', color: "244 55% 41%", foreground: "0 0% 100%" }, // #6366f1 (Default-ish) -- Hoppscotch default is usually Indigo or Purple
  purple: { id: 'purple', name: 'Purple', color: "262 83% 58%", foreground: "0 0% 100%" }, // #a855f7 (Hoppscotch primary is often purple)
  yellow: { id: 'yellow', name: 'Yellow', color: "48 96% 53%", foreground: "0 0% 0%" },    // #eab308
  orange: { id: 'orange', name: 'Orange', color: "24 94% 50%", foreground: "0 0% 100%" },  // #f97316
  red: { id: 'red', name: 'Red', color: "0 84% 60%", foreground: "0 0% 100%" },            // #ef4444
  pink: { id: 'pink', name: 'Pink', color: "330 81% 60%", foreground: "0 0% 100%" },       // #ec4899
};

export interface TerminalTheme {
  name: string;
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

export const terminalThemes: Record<TerminalThemeId, TerminalTheme> = {
  default: {
    name: 'Default (Dark)',
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
  },
  adventureTime: {
    name: 'Adventure Time',
    background: '#1f1d45',
    foreground: '#f8dcc0',
    cursor: '#efac32',
    selectionBackground: '#4e7cbf',
    black: '#050404',
    red: '#bd0013',
    green: '#4ab118',
    yellow: '#e7741e',
    blue: '#0f4ac6',
    magenta: '#665993',
    cyan: '#70a598',
    white: '#f8dcc0',
    brightBlack: '#4e7cbf',
    brightRed: '#fc5f5a',
    brightGreen: '#9eff6e',
    brightYellow: '#efc11a',
    brightBlue: '#1997c6',
    brightMagenta: '#9b5953',
    brightCyan: '#c8faf4',
    brightWhite: '#f6f5fb',
  },
  afterglow: {
    name: 'Afterglow',
    background: '#222222',
    foreground: '#d0d0d0',
    cursor: '#d0d0d0',
    selectionBackground: '#303030',
    black: '#151515',
    red: '#a53c23',
    green: '#7b9246',
    yellow: '#d3a04d',
    blue: '#6c99bb',
    magenta: '#9f4e85',
    cyan: '#7dd6cf',
    white: '#d0d0d0',
    brightBlack: '#505050',
    brightRed: '#a53c23',
    brightGreen: '#7b9246',
    brightYellow: '#d3a04d',
    brightBlue: '#6c99bb',
    brightMagenta: '#9f4e85',
    brightCyan: '#7dd6cf',
    brightWhite: '#f5f5f5',
  },
  alienBlood: {
    name: 'Alien Blood',
    background: '#0f1610',
    foreground: '#637d75',
    cursor: '#637d75',
    selectionBackground: '#1d2622',
    black: '#112616',
    red: '#7f2b27',
    green: '#2f7e25',
    yellow: '#717f24',
    blue: '#2f6a7f',
    magenta: '#47587f',
    cyan: '#327f77',
    white: '#647d75',
    brightBlack: '#3c4812',
    brightRed: '#e08009',
    brightGreen: '#18e000',
    brightYellow: '#bde000',
    brightBlue: '#00aae0',
    brightMagenta: '#00e0c4',
    brightCyan: '#00e06f',
    brightWhite: '#73fa91',
  },
  argonaut: {
    name: 'Argonaut',
    background: '#0e1019',
    foreground: '#fffaf4',
    cursor: '#ff0018',
    selectionBackground: '#002a3b',
    black: '#232323',
    red: '#ff000f',
    green: '#8ce10b',
    yellow: '#ffb900',
    blue: '#008df8',
    magenta: '#6d43a6',
    cyan: '#00d8eb',
    white: '#ffffff',
    brightBlack: '#444444',
    brightRed: '#ff2740',
    brightGreen: '#abe15b',
    brightYellow: '#ffd242',
    brightBlue: '#0092ff',
    brightMagenta: '#9a5feb',
    brightCyan: '#67fff0',
    brightWhite: '#ffffff',
  },
  dracula: {
    name: 'Dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    cursor: '#f8f8f0',
    selectionBackground: '#44475a',
    black: '#21222c',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#f8f8f2',
    brightBlack: '#6272a4',
    brightRed: '#ff6e6e',
    brightGreen: '#69ff94',
    brightYellow: '#ffffa5',
    brightBlue: '#d6acff',
    brightMagenta: '#ff92df',
    brightCyan: '#a4ffff',
    brightWhite: '#ffffff',
  },
  githubLight: {
    name: 'GitHub Light',
    background: '#ffffff',
    foreground: '#24292f',
    cursor: '#044289',
    selectionBackground: '#cee9f9',
    black: '#24292f',
    red: '#cf222e',
    green: '#116329',
    yellow: '#4d2d00',
    blue: '#0969da',
    magenta: '#8250df',
    cyan: '#1b7c83',
    white: '#6e7781',
    brightBlack: '#6e7781',
    brightRed: '#a40e26',
    brightGreen: '#1a7f37',
    brightYellow: '#9a6700',
    brightBlue: '#218bff',
    brightMagenta: '#a475f9',
    brightCyan: '#3192aa',
    brightWhite: '#8c959f',
  },
  solarizedDark: {
    name: 'Solarized Dark',
    background: '#002b36',
    foreground: '#839496',
    cursor: '#93a1a1',
    selectionBackground: '#073642',
    black: '#073642',
    red: '#dc322f',
    green: '#859900',
    yellow: '#b58900',
    blue: '#268bd2',
    magenta: '#d33682',
    cyan: '#2aa198',
    white: '#eee8d5',
    brightBlack: '#002b36',
    brightRed: '#cb4b16',
    brightGreen: '#586e75',
    brightYellow: '#657b83',
    brightBlue: '#839496',
    brightMagenta: '#6c71c4',
    brightCyan: '#93a1a1',
    brightWhite: '#fdf6e3',
  },
  monokaiPro: {
    name: 'Monokai Pro',
    background: '#2D2A2E',
    foreground: '#FCFCFA',
    cursor: '#FFD866',
    selectionBackground: '#403E41',
    black: '#2D2A2E',
    red: '#FF6188',
    green: '#A9DC76',
    yellow: '#FFD866',
    blue: '#FC9867',
    magenta: '#AB9DF2',
    cyan: '#78DCE8',
    white: '#FCFCFA',
    brightBlack: '#727072',
    brightRed: '#FF6188',
    brightGreen: '#A9DC76',
    brightYellow: '#FFD866',
    brightBlue: '#FC9867',
    brightMagenta: '#AB9DF2',
    brightCyan: '#78DCE8',
    brightWhite: '#FCFCFA',
  },
  bounds: {
    name: 'Bounds',
    background: '#171c23',
    foreground: '#d7dae0',
    cursor: '#4db2ea',
    selectionBackground: '#2d3b4f',
    black: '#171c23',
    red: '#e06c75',
    green: '#98c379',
    yellow: '#e5c07b',
    blue: '#61afef',
    magenta: '#c678dd',
    cyan: '#56b6c2',
    white: '#abb2bf',
    brightBlack: '#5c6370',
    brightRed: '#e06c75',
    brightGreen: '#98c379',
    brightYellow: '#e5c07b',
    brightBlue: '#61afef',
    brightMagenta: '#c678dd',
    brightCyan: '#56b6c2',
    brightWhite: '#ffffff',
  },
  cyberpunk: {
    name: 'Cyberpunk 2077',
    background: '#0d0221',
    foreground: '#00ff41',
    cursor: '#fcee0a',
    selectionBackground: '#ff003c',
    black: '#000000',
    red: '#ff003c',
    green: '#00ff41',
    yellow: '#fcee0a',
    blue: '#00e0ff',
    magenta: '#ff00ff',
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
  },
  taxuexunmei: {
    name: 'Plum Blossom',
    background: '#fffafa',
    foreground: '#4a4a4a',
    cursor: '#c71585',
    selectionBackground: '#ffb6c1',
    black: '#000000',
    red: '#b22222',
    green: '#228b22',
    yellow: '#daa520',
    blue: '#4682b4',
    magenta: '#c71585',
    cyan: '#20b2aa',
    white: '#dcdcdc',
    brightBlack: '#808080',
    brightRed: '#cd5c5c',
    brightGreen: '#32cd32',
    brightYellow: '#ffd700',
    brightBlue: '#87ceeb',
    brightMagenta: '#ff69b4',
    brightCyan: '#40e0d0',
    brightWhite: '#ffffff',
  },
  pixel: {
    name: 'Retro Pixel',
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
  },
  zangqing: {
    name: '藏青 (Terminal)',
    background: '#081426',
    foreground: '#ffffff',
    cursor: '#1d4ed8',
    selectionBackground: '#1e3a8a',
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
};
