import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { KanbanBoard } from '../components/todo/KanbanBoard'
import { TodoModal } from '../components/todo/TodoModal'
import { useSettingsStore } from '../store/settingsStore'

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useSettingsStore()

  return (
    <div className="min-h-screen transition-colors">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-1">{t('myTasks')}</h1>
            <p className="text-[#A9B388] subtitle-text">{t('organizeWithKanban')}</p>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('newTask')}</span>
          </button>
        </div>

        <KanbanBoard />
      </main>

      <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
