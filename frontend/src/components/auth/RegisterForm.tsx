import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const { register, isLoading, error, clearError } = useAuthStore()
  const { t } = useSettingsStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError(t('passwordsMismatch'))
      return
    }

    if (password.length < 8) {
      setLocalError(t('passwordTooShort'))
      return
    }

    try {
      await register({ email, username, password })
      navigate('/')
    } catch {}
  }

  const displayError = localError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {displayError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{displayError}</p>
          <button type="button" onClick={() => { setLocalError(null); clearError() }} className="ml-auto text-red-400/60 hover:text-red-400">×</button>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-300">{t('email')}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-12" placeholder={t('enterEmail')} required autoComplete="email" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-300">{t('username')}</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input pl-12" placeholder={t('enterUsername')} required autoComplete="username" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-300">{t('password')}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-12" placeholder={t('minChars')} required autoComplete="new-password" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-300">{t('confirmPassword')}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input pl-12" placeholder={t('repeatPassword')} required autoComplete="new-password" />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3 text-base">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" />{t('register')}</>}
      </button>

      <p className="text-center text-dark-400">
        {t('hasAccount')}{' '}
        <Link to="/login" className="text-[#B99470] hover:text-[#A9B388] font-medium">{t('signIn')}</Link>
      </p>
    </form>
  )
}
