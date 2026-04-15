import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'todo-react-app-v1'

export default function App() {
  const [taskText, setTaskText] = useState('')
  const [filter, setFilter] = useState('all')
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter((task) => !task.done)
    if (filter === 'done') return tasks.filter((task) => task.done)
    return tasks
  }, [tasks, filter])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.done).length
    const pending = total - completed
    return { total, completed, pending }
  }, [tasks])

  function handleAddTask(event) {
    event.preventDefault()
    const normalized = taskText.trim()
    if (!normalized) return

    const newTask = {
      id: crypto.randomUUID(),
      text: normalized,
      done: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((current) => [newTask, ...current])
    setTaskText('')
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  function removeTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.done))
  }

  return (
    <main className="page">
      <section className="card">
        <div className="hero">
          <div>
            <p className="eyebrow">Projeto React</p>
            <h1>Lista de Tarefas</h1>
            <p className="subtitle">
              Organize sua rotina com filtros, estatísticas e salvamento local.
            </p>
          </div>
          <div className="stats-grid">
            <article>
              <strong>{stats.total}</strong>
              <span>Total</span>
            </article>
            <article>
              <strong>{stats.pending}</strong>
              <span>Pendentes</span>
            </article>
            <article>
              <strong>{stats.completed}</strong>
              <span>Concluídas</span>
            </article>
          </div>
        </div>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite uma nova tarefa"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            aria-label="Nova tarefa"
          />
          <button type="submit">Adicionar</button>
        </form>

        <div className="toolbar">
          <div className="filters">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
              type="button"
            >
              Todas
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
              type="button"
            >
              Pendentes
            </button>
            <button
              className={filter === 'done' ? 'active' : ''}
              onClick={() => setFilter('done')}
              type="button"
            >
              Concluídas
            </button>
          </div>
          <button className="ghost" type="button" onClick={clearCompleted}>
            Limpar concluídas
          </button>
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty-state">Nenhuma tarefa encontrada nesse filtro.</li>
          ) : (
            filteredTasks.map((task) => (
              <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                </label>
                <button type="button" onClick={() => removeTask(task.id)}>
                  Excluir
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  )
}
