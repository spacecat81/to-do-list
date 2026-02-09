import { Plus } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { KanbanBoard } from '../components/todo/KanbanBoard'
import { TodoModal } from '../components/todo/TodoModal'
import { useSettingsStore } from '../store/settingsStore'

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useSettingsStore()

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--md-surface)' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1
              className="md-headline-medium font-medium mb-1"
              style={{ color: 'var(--md-on-surface)' }}
            >
              {t('myTasks')}
            </h1>
            <p className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
              {t('organizeWithKanban')}
            </p>
          </div>

          {/* Extended FAB for desktop */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="fab fab-extended hidden sm:inline-flex"
          >
            <Plus className="w-6 h-6" />
            <span className="md-label-large">{t('newTask')}</span>
          </motion.button>
        </motion.div>

        <KanbanBoard />
      </main>

      {/* Mobile FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fab fixed bottom-6 right-6 z-30 sm:hidden"
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
        }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
