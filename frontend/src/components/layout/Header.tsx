import { useState } from 'react'
import { CheckSquare, LogOut, User, Sun, Moon, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { Language } from '../../i18n/translations'

const languageNames: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
  pl: 'Polski',
}

const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
  pl: '🇵🇱',
}

export function Header() {
  const { user, logout } = useAuthStore()
  const { language, theme, setLanguage, toggleTheme, t } = useSettingsStore()
  const [showLangMenu, setShowLangMenu] = useState(false)

  return (
    <header className="glass sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#A9B388] to-[#B99470] shadow-lg shadow-[#B99470]/25">
              <CheckSquare className="w-5 h-5 text-[#FEFAE0]" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-[#A9B388]">W</span>
              <span className="text-[#FEFAE0] wtd-letter-t">T</span>
              <span className="text-[#B99470]">D</span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost p-2"
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="btn btn-ghost px-2 sm:px-3"
              >
                <span className="text-lg">{languageFlags[language]}</span>
                <span className="hidden sm:inline text-sm">{languageNames[language]}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-40 card p-1 animate-scale-in">
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setShowLangMenu(false)
                        }}
                        className={`
                          w-full px-3 py-2 text-left text-sm rounded-lg flex items-center gap-2 transition-colors
                          ${language === lang ? 'bg-[#A9B388]/30 text-[#FEFAE0]' : 'hover:bg-dark-700'}
                        `}
                      >
                        <span className="text-lg">{languageFlags[lang]}</span>
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-700/50 rounded-full">
              <User className="w-4 h-4 text-dark-400" />
              <span className="text-sm font-medium text-dark-200">{user?.username}</span>
            </div>
            
            <button onClick={logout} className="btn btn-ghost" title={t('logout')}>
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
