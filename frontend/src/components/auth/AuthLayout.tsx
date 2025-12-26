import { ReactNode, useState } from 'react'
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5F6F52] via-[#6b7d5c] to-[#5F6F52]" />
      
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#A9B388]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#B99470]/30 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-[#6b7d5c]/50 text-[#A9B388] hover:text-[#FEFAE0] hover:bg-[#A9B388]/30 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 px-3 rounded-xl bg-[#6b7d5c]/50 text-[#A9B388] hover:text-[#FEFAE0] hover:bg-[#A9B388]/30 transition-colors flex items-center gap-1"
          >
            <span>{languageFlags[language]}</span>
            <span className="text-sm">{languageNames[language]}</span>
          </button>
          
          {showLangMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-32 card p-1 animate-scale-in">
                {(Object.keys(languageFlags) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang)
                      setShowLangMenu(false)
                    }}
                    className={`
                      w-full px-3 py-2 text-left text-sm rounded-lg flex items-center gap-2 text-[#FEFAE0]
                      ${language === lang ? 'bg-[#A9B388]/30' : 'hover:bg-[#A9B388]/20'}
                    `}
                  >
                    <span>{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A9B388] to-[#B99470] mb-4 shadow-xl shadow-[#B99470]/25">
            <CheckSquare className="w-8 h-8 text-[#FEFAE0]" />
          </div>
          <div className="text-4xl font-bold mb-2">
            <span className="text-[#A9B388]">W</span>
            <span className="text-[#FEFAE0] wtd-letter-t">T</span>
            <span className="text-[#B99470]">D</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#FEFAE0] mb-2">{title}</h1>
          <p className="text-[#A9B388]">{subtitle}</p>
        </div>
        
        <div className="card p-8">{children}</div>
        
        <p className="text-center text-[#A9B388] text-sm mt-6">{t('tagline')}</p>
      </div>
    </div>
  )
}
