import { create } from 'zustand';
import { Theme, ThemeId, themes } from '../shared/themes';

interface ThemeState {
  currentThemeId: ThemeId;
  theme: Theme;
  setTheme: (id: ThemeId) => void;
  initTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentThemeId: 'dark',
  theme: themes['dark'],
  
  setTheme: (id: ThemeId) => {
    const theme = themes[id];
    set({ currentThemeId: id, theme });
    
    // Apply CSS variables
    const root = document.documentElement;
    
    // Set class for dark/light mode for Tailwind
    if (theme.type === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set custom font
    document.body.style.fontFamily = theme.fontFamily;

    // Set CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Persist
    window.electron.storeSet('theme', id);
  },

  initTheme: async () => {
    const savedThemeId = await window.electron.storeGet('theme');
    if (savedThemeId && themes[savedThemeId as ThemeId]) {
      get().setTheme(savedThemeId as ThemeId);
    } else {
      // Default to dark
      get().setTheme('dark');
    }
  }
}));
