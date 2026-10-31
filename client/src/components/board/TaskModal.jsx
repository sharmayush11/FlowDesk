import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateTask, deleteTask } from '../../store/slices/taskSlice'

const TaskModal = ({ task, onClose }) => {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    priority: ['low', 'medium', 'high'].includes(
      task.priority?.toLowerCase()
    )
      ? task.priority.toLowerCase()
      : 'medium',
  })

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('Task title is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const result = await dispatch(
        updateTask({
          id: task._id,
          ...form,
          title: form.title.trim(),
        })
      )

      if (updateTask.fulfilled.match(result)) {
        onClose()
      } else {
        setError(result.payload || 'Failed to update task.')
      }
    } catch {
      setError('Something went wrong while updating the task.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')

    try {
      const result = await dispatch(deleteTask(task._id))

      if (deleteTask.fulfilled.match(result)) {
        onClose()
      } else {
        setError(result.payload || 'Failed to delete task.')
      }
    } catch {
      setError('Something went wrong while deleting the task.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
      >
        <h2 className="task-modal-heading">Edit Task</h2>

        {error && (
          <div className="task-modal-error" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="task-title">Task Title *</label>
          <input
            id="task-title"
            className="task-modal-title"
            value={form.title}
            maxLength={150}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="task-modal-desc"
            value={form.description}
            placeholder="Add a description..."
            maxLength={2000}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
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

        <div className="form-group">
          <label htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />
        </div>

        {task.assignee && (
          <div className="task-modal-assignee">
            <img
              src={
                task.assignee.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  task.assignee.name || 'Member'
                )}&size=32`
              }
              alt={task.assignee.name || 'Assignee'}
            />
            <span>{task.assignee.name}</span>
          </div>
        )}

        <div className="task-modal-actions">
          <button
            type="button"
            className="task-delete-btn"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Task'}
          </button>

          <div className="task-modal-actions-right">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={saving || deleting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={saving || deleting}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskModal

