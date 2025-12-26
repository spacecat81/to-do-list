import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translations, type Language, type TranslationKey } from '../i18n/translations'

type Theme = 'light' | 'dark'

interface SettingsState {
  language: Language
  theme: Theme
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  t: (key: TranslationKey) => string
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'dark',
      
      setLanguage: (language) => set({ language }),
      
      setTheme: (theme) => {
        document.documentElement.classList.toggle('light', theme === 'light')
        set({ theme })
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.toggle('light', newTheme === 'light')
        set({ theme: newTheme })
      },
      
      t: (key) => {
        const lang = get().language
        return translations[lang][key] || translations.en[key] || key
      },
    }),
    {
      name: 'wtd-settings',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'light') {
          document.documentElement.classList.add('light')
        }
      },
    }
  )
)
