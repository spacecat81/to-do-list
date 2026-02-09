import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Sun, Moon } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'
import type { Language } from '../../i18n/translations'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
  pl: '🇵🇱',
}

const languageNames: Record<Language, string> = {
  en: 'EN',
  ru: 'RU',
  pl: 'PL',
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { theme, language, toggleTheme, setLanguage, t } = useSettingsStore()
  const [showLangMenu, setShowLangMenu] = useState(false)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--md-surface)' }}
    >
      {/* Subtle background decoration */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-[0.04]"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, var(--md-primary) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, var(--md-tertiary) 0%, transparent 50%)`,
        }}
      />

      {/* Top bar controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="icon-btn"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.div>
        </motion.button>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="icon-btn w-auto px-3 gap-1.5"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            <span>{languageFlags[language]}</span>
            <span className="md-label-medium">{languageNames[language]}</span>
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowLangMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-36 rounded-md py-1 z-50"
                style={{
                  backgroundColor: 'var(--md-surface-container)',
                  boxShadow: '0 2px 6px 2px rgba(0,0,0,.15), 0 1px 2px 0 rgba(0,0,0,.3)',
                }}
              >
                {(Object.keys(languageFlags) as Language[]).map((lang) => (
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
        </div>
      </div>

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{ backgroundColor: 'var(--md-primary-container)' }}
          >
            <CheckSquare className="w-8 h-8" style={{ color: 'var(--md-on-primary-container)' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-3"
          >
            <span style={{ color: 'var(--md-primary)' }}>W</span>
            <span style={{ color: 'var(--md-on-surface)' }}>T</span>
            <span style={{ color: 'var(--md-tertiary)' }}>D</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="md-headline-small font-semibold mb-2"
            style={{ color: 'var(--md-on-surface)' }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md-body-medium"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] }}
          className="card-elevated p-8"
        >
          {children}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center md-body-small mt-6"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          {t('tagline')}
        </motion.p>
      </motion.div>
    </div>
  )
}
