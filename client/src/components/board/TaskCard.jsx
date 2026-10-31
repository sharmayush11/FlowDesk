
import { useState } from 'react'
import TaskModal from './TaskModal'

const TaskCard = ({ task, isDragging }) => {
  const [showModal, setShowModal] = useState(false)

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate).toDateString() !== new Date().toDateString() &&
    new Date(task.dueDate) < new Date()

  const priority = ['high', 'medium', 'low'].includes(
    task.priority?.toLowerCase()
  )
    ? task.priority.toLowerCase()
    : null

  return (
    <>
      <div
        className={`task-card ${isDragging ? 'dragging' : ''}`}
        onClick={() => setShowModal(true)}
      >
        {/* Priority and labels */}
        {(priority || task.labels?.length > 0) && (
          <div className="task-card-badges">
            {priority && (
              <span className={`priority-badge priority-${priority}`}>
                {priority === 'high' && '🔴'}
                {priority === 'medium' && '🟡'}
                {priority === 'low' && '🟢'}
                {' '}
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            )}

            {task.labels?.map((label, i) => (
              <span
                key={i}
                className="label-pill"
                style={{ background: label.color }}
              >
                {label.text}
              </span>
            ))}
          </div>
        )}

        {/* Task title */}
        <p className="task-title">{task.title}</p>

        {/* Task footer */}
        <div className="task-footer">
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              📅{' '}
              {new Date(task.dueDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
              {isOverdue && ' · Overdue'}
            </span>
          )}

          {task.comments?.length > 0 && (
            <span className="comment-count">
              💬 {task.comments.length}
            </span>
          )}

          {task.attachments?.length > 0 && (
            <span className="attach-count">
              📎 {task.attachments.length}
            </span>
          )}

          {task.assignee && (
            <img
              src={
                task.assignee.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  task.assignee.name || 'Member'
                )}&size=24`
              }
              alt={task.assignee.name || 'Assignee'}
              className="assignee-avatar"
              title={task.assignee.name || 'Assignee'}
            />
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default TaskCard

