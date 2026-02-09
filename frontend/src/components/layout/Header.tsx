import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: 'var(--md-surface-container)',
        borderColor: 'var(--md-outline-variant)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: 'var(--md-primary-container)' }}
            >
              <CheckSquare className="w-5 h-5" style={{ color: 'var(--md-on-primary-container)' }} />
            </div>
            <span className="text-xl font-bold">
              <span style={{ color: 'var(--md-primary)' }}>W</span>
              <span style={{ color: 'var(--md-on-surface)' }}>T</span>
              <span style={{ color: 'var(--md-tertiary)' }}>D</span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="icon-btn"
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="icon-btn w-auto px-2 sm:px-3 gap-1"
              >
                <span className="text-base">{languageFlags[language]}</span>
                <span className="hidden sm:inline md-label-medium">{languageNames[language]}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-20 w-44 rounded-md py-1"
                      style={{
                        backgroundColor: 'var(--md-surface-container)',
                        boxShadow: '0 2px 6px 2px rgba(0,0,0,.15), 0 1px 2px 0 rgba(0,0,0,.3)',
                      }}
                    >
                      {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang)
                            setShowLangMenu(false)
                          }}
                          className="w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors md-body-medium"
                          style={{
                            color: language === lang ? 'var(--md-primary)' : 'var(--md-on-surface)',
                            backgroundColor: language === lang ? 'var(--md-primary-container)' : 'transparent',
                          }}
                        >
                          <span className="text-base">{languageFlags[lang]}</span>
                          {languageNames[lang]}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User info */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full md-label-medium"
              style={{
                backgroundColor: 'var(--md-surface-container-high)',
                color: 'var(--md-on-surface-variant)',
              }}
            >
              <User className="w-4 h-4" />
              <span>{user?.username}</span>
            </div>

            {/* Logout */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="btn btn-ghost px-3 sm:px-4"
              title={t('logout')}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline md-label-large">{t('logout')}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}
