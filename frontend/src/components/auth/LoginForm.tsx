import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, User, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
}

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [shaking, setShaking] = useState(false)
  const { login, isLoading } = useAuthStore()
  const { t } = useSettingsStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login({ username, password })
      navigate('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      toast.error(message)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`space-y-5 ${shaking ? 'animate-shake' : ''}`}
    >
      <motion.div variants={fadeUp} className="space-y-1.5">
        <label className="md-label-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          {t('username')}
        </label>
        <div className="relative">
          <User
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--md-on-surface-variant)' }}
          />
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
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-1.5">
        <label className="md-label-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          {t('password')}
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--md-on-surface-variant)' }}
          />
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
      </motion.div>

      <motion.div variants={fadeUp}>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full py-3"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              {t('login')}
            </>
          )}
        </button>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-center md-body-medium"
        style={{ color: 'var(--md-on-surface-variant)' }}
      >
        {t('noAccount')}{' '}
        <Link
          to="/register"
          className="font-medium transition-colors"
          style={{ color: 'var(--md-primary)' }}
        >
          {t('signUp')}
        </Link>
      </motion.p>
    </motion.form>
  )
}
