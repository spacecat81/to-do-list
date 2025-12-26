import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, User, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, clearError } = useAuthStore()
  const { t } = useSettingsStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login({ username, password })
      navigate('/')
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
          <button type="button" onClick={clearError} className="ml-auto text-red-400/60 hover:text-red-400">×</button>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-300">{t('username')}</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input pl-12"
            placeholder={t('enterUsername')}
            required
            autoComplete="username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-300">{t('password')}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pl-12"
            placeholder={t('enterPassword')}
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3 text-base">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" />{t('login')}</>}
      </button>

      <p className="text-center text-dark-400">
        {t('noAccount')}{' '}
        <Link to="/register" className="text-[#B99470] hover:text-[#A9B388] font-medium">{t('signUp')}</Link>
      </p>
    </form>
  )
}
