import { create } from 'zustand';
import { Language } from '../shared/locales';

interface SettingsState {
    language: Language;
    fontFamily: string;
    setLanguage: (lang: Language) => void;
    setFontFamily: (font: string) => void;
    initSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    language: 'en',
    fontFamily: 'Inter', // Default font

    setLanguage: (lang: Language) => {
        set({ language: lang });
        window.electron.storeSet('language', lang);
    },

    setFontFamily: (font: string) => {
        set({ fontFamily: font });
        window.electron.storeSet('fontFamily', font);
    },

    initSettings: async () => {
        const savedLang = await window.electron.storeGet('language');
        const savedFont = await window.electron.storeGet('fontFamily');

        set({
            language: (savedLang as Language) || 'en',
            fontFamily: (savedFont as string) || 'Inter'
        });
    }
}));
