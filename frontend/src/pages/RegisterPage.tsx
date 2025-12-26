import { AuthLayout } from '../components/auth/AuthLayout'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useSettingsStore } from '../store/settingsStore'

export function RegisterPage() {
  const { t } = useSettingsStore()
  
  return (
    <AuthLayout title={t('createAccount')} subtitle={t('registerSubtitle')}>
      <RegisterForm />
    </AuthLayout>
  )
}
