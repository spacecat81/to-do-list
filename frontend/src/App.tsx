import { useEffect, type ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/authStore'
import { useSettingsStore } from './store/settingsStore'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--md-surface)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{
            borderColor: 'var(--md-surface-container-highest)',
            borderTopColor: 'var(--md-primary)',
          }}
        />
        <p className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          Loading...
        </p>
      </motion.div>
    </div>
  )
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <LoadingScreen />
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { checkAuth } = useAuthStore()
  const theme = useSettingsStore((s: { theme: string }) => s.theme)
  const location = useLocation()

  useEffect(() => { checkAuth() }, [checkAuth])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--md-surface-container-high)',
            color: 'var(--md-on-surface)',
            border: '1px solid var(--md-outline-variant)',
            borderRadius: '16px',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.15px',
            padding: '16px 20px',
            textAlign: 'center' as const,
            boxShadow: '0 6px 10px 4px rgba(0,0,0,.15), 0 2px 3px 0 rgba(0,0,0,.3)',
            minWidth: '300px',
            maxWidth: '420px',
          },
          classNames: {
            error: 'toast-error',
            success: 'toast-success',
          },
        }}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />

      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
