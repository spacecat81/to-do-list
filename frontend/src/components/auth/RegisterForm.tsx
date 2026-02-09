import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
}

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [shaking, setShaking] = useState(false)
  const { register, isLoading } = useAuthStore()
  const { t } = useSettingsStore()
  const navigate = useNavigate()

  const triggerShake = () => {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error(t('passwordsMismatch'))
      triggerShake()
      return
    }

    if (password.length < 8) {
      toast.error(t('passwordTooShort'))
      triggerShake()
      return
    }

    try {
      await register({ email, username, password })
      navigate('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      toast.error(message)
      triggerShake()
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`space-y-4 ${shaking ? 'animate-shake' : ''}`}
    >
      <motion.div variants={fadeUp} className="space-y-1.5">
        <label className="md-label-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          {t('email')}
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--md-on-surface-variant)' }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input pl-12"
            placeholder={t('enterEmail')}
            required
            autoComplete="email"
          />
        </div>
      </motion.div>

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
            placeholder={t('minChars')}
            required
            autoComplete="new-password"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-1.5">
        <label className="md-label-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          {t('confirmPassword')}
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--md-on-surface-variant)' }}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input pl-12"
            placeholder={t('repeatPassword')}
            required
            autoComplete="new-password"
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
              <UserPlus className="w-5 h-5" />
              {t('register')}
            </>
          )}
        </button>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-center md-body-medium"
        style={{ color: 'var(--md-on-surface-variant)' }}
      >
        {t('hasAccount')}{' '}
        <Link
          to="/login"
          className="font-medium transition-colors"
          style={{ color: 'var(--md-primary)' }}
        >
          {t('signIn')}
        </Link>
      </motion.p>
    </motion.form>
  )
}
