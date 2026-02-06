import { useSettingsStore } from '../store/settingsStore';
import { translations, Language } from '../shared/locales';

export function useTranslation() {
    const { language } = useSettingsStore();

    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = translations[language];

        for (const k of keys) {
            if (current && current[k]) {
                current = current[k];
            } else {
                // Fallback to English if not found
                current = null;
                break;
            }
        }

        if (current === null || typeof current !== 'string') {
            // Try English fallback
            let enCurrent: any = translations['en'];
            let found = true;
            for (const k of keys) {
                if (enCurrent && enCurrent[k]) {
                    enCurrent = enCurrent[k];
                } else {
                    found = false;
                    break;
                }
            }
            if (found && typeof enCurrent === 'string') return enCurrent;
            return key;
        }

        return current as string;
    };

    return { t, language };
}
