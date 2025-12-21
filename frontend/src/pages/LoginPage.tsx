import { AuthLayout } from '../components/auth/AuthLayout'
import { LoginForm } from '../components/auth/LoginForm'
import { useSettingsStore } from '../store/settingsStore'

export function LoginPage() {
  const { t } = useSettingsStore()
  
  return (
    <AuthLayout title={t('welcome')} subtitle={t('loginSubtitle')}>
      <LoginForm />
    </AuthLayout>
  )
}
