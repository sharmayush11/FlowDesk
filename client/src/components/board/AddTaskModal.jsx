import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createTask } from '../../store/slices/taskSlice'

const AddTaskModal = ({ boardId, columnId, onClose }) => {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('Task title is required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await dispatch(
        createTask({
          ...form,
          title: form.title.trim(),
          board: boardId,
          columnId,
          dueDate: form.dueDate || undefined,
        })
      )

      if (createTask.fulfilled.match(result)) {
        onClose()
      } else {
        setError(result.payload || 'Failed to create task.')
      }
    } catch {
      setError('Something went wrong while creating the task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Task</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="task-modal-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label htmlFor="new-task-title">Title *</label>
            <input
              id="new-task-title"
              type="text"
              value={form.title}
              placeholder="Task title"
              maxLength={150}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              autoFocus
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label htmlFor="new-task-description">Description</label>
            <textarea
              id="new-task-description"
              value={form.description}
              placeholder="Add description..."
              maxLength={2000}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1.5px solid #dfe1e6',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label htmlFor="new-task-priority">Priority</label>
            <select
              id="new-task-priority"
              className="task-priority-select"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label htmlFor="new-task-due-date">Due Date</label>
            <input
              id="new-task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal

