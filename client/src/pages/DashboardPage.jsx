
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchBoards,
  createBoard,
  deleteBoard,
} from '../store/slices/boardSlice'
import Navbar from '../components/common/Navbar'

const COLORS = [
  '#4f46e5',
  '#0891b2',
  '#059669',
  '#ea580c',
  '#7c3aed',
  '#db2777',
  '#0d9488',
  '#2563eb',
]

const DashboardPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items = [], loading } = useSelector((s) => s.boards)
  const { user } = useSelector((s) => s.auth)

  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    background: COLORS[0],
  })

  useEffect(() => {
    dispatch(fetchBoards())
  }, [dispatch])

  const filteredBoards = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return items

    return items.filter((board) =>
      board.title?.toLowerCase().includes(query)
    )
  }, [items, search])

  const handleCreate = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const result = await dispatch(createBoard(form))

    if (result.meta.requestStatus === 'fulfilled') {
      setShowModal(false)
      setForm({
        title: '',
        description: '',
        background: COLORS[0],
      })
    } else {
      setErrorMessage(result.payload || 'Failed to create board.')
    }
  }

  const handleDeleteBoard = async (e, board) => {
    e.stopPropagation()

    const confirmed = window.confirm(
      `Are you sure you want to delete "${board.title}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(board._id)
    setErrorMessage('')

    try {
      const result = await dispatch(deleteBoard(board._id))

      if (deleteBoard.fulfilled.match(result)) {
        setErrorMessage('')
      } else {
        setErrorMessage(
          result.payload || 'Failed to delete board. Please try again.'
        )
      }
    } catch {
      setErrorMessage('Something went wrong while deleting the board.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <section className="welcome-section">
          <div>
            <p className="welcome-eyebrow">YOUR WORKSPACE</p>
            <h1>
              Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
            </h1>
            <p className="welcome-description">
              Organize your work, track progress, and keep everything moving.
            </p>
          </div>

          <button
            className="btn-create"
            onClick={() => {
              setErrorMessage('')
              setShowModal(true)
            }}
          >
            + Create Board
          </button>
        </section>

        {errorMessage && (
          <div className="dashboard-error" role="alert">
            {errorMessage}
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <section className="dashboard-stats">
          <article className="stat-card">
            <div className="stat-icon">▦</div>
            <div>
              <p className="stat-label">Total Boards</p>
              <h2 className="stat-value">{items.length}</h2>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <p className="stat-label">Workspace</p>
              <h2 className="stat-value">Active</h2>
            </div>
          </article>
        </section>

        <section className="boards-section">
          <div className="boards-section-header">
            <div>
              <h2>My Boards</h2>
              <p>All your projects in one place.</p>
            </div>

            <span className="boards-count">
              {items.length} {items.length === 1 ? 'board' : 'boards'}
            </span>
          </div>

          <div className="board-search">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your boards..."
              aria-label="Search boards by title"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {loading ? (
            <p className="dashboard-message">Loading your boards...</p>
          ) : filteredBoards.length === 0 ? (
            <div className="dashboard-empty">
              <div className="empty-icon">{search ? '⌕' : '▦'}</div>

              <h3>{search ? 'No matching boards' : 'No boards yet'}</h3>

              <p>
                {search
                  ? 'Try a different search term.'
                  : 'Create your first board to organize your work.'}
              </p>

              {search ? (
                <button
                  className="btn-create"
                  onClick={() => setSearch('')}
                >
                  Clear Search
                </button>
              ) : (
                <button
                  className="btn-create"
                  onClick={() => setShowModal(true)}
                >
                  + Create Your First Board
                </button>
              )}
            </div>
          ) : (
            <div className="boards-grid">
              {filteredBoards.map((board) => (
                <article
                  key={board._id}
                  className="board-card"
                  style={{ background: board.background || COLORS[0] }}
                  onClick={() => navigate(`/board/${board._id}`)}
                  onKeyDown={(e) => {
                    if (
                      (e.key === 'Enter' || e.key === ' ') &&
                      e.target === e.currentTarget
                    ) {
                      e.preventDefault()
                      navigate(`/board/${board._id}`)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open board ${board.title}`}
                >
                  <div className="board-card-top">
                    <span className="board-card-icon">▦</span>

                    <button
                      type="button"
                      className="board-delete-btn"
                      title="Delete board"
                      aria-label={`Delete ${board.title}`}
                      disabled={deletingId === board._id}
                      onClick={(e) => handleDeleteBoard(e, board)}
                    >
                      {deletingId === board._id ? '…' : '⋯'}
                    </button>
                  </div>

                  <div>
                    <h3 className="board-card-title">{board.title}</h3>

                    {board.description && (
                      <p className="board-card-description">
                        {board.description}
                      </p>
                    )}
                  </div>

                  <div className="board-card-bottom">
                    <div className="board-card-members">
                      {board.members?.slice(0, 4).map((member, index) => {
                        const memberUser = member.user

                        if (!memberUser) return null

                        return (
                          <img
                            key={memberUser._id || index}
                            src={
                              memberUser.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                memberUser.name || 'Member'
                              )}&size=28&background=ffffff&color=4f46e5`
                            }
                            alt={memberUser.name || 'Board member'}
                            className="member-avatar-sm"
                            title={memberUser.name || 'Board member'}
                          />
                        )
                      })}
                    </div>

                    <span className="board-open-label">Open board →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Board</h2>

            <form onSubmit={handleCreate}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="board-title">Board Title *</label>
                <input
                  id="board-title"
                  type="text"
                  value={form.title}
                  placeholder="e.g. Website Redesign"
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="board-description">Description</label>
                <input
                  id="board-description"
                  type="text"
                  value={form.description}
                  placeholder="What is this board for?"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  maxLength={250}
                />
              </div>

              <div className="form-group">
                <label>Choose a color</label>

                <div className="board-color-options">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Choose ${color} board color`}
                      aria-pressed={form.background === color}
                      onClick={() => setForm({ ...form, background: color })}
                      className={`board-color-option ${
                        form.background === color ? 'selected' : ''
                      }`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-submit">
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardPage

