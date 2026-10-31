import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentBoard } from '../store/slices/boardSlice'
import Navbar from '../components/common/Navbar'
import KanbanBoard from '../components/board/KanbanBoard'
import api from '../api/axios'
import { useState } from 'react'

const BoardPage = () => {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { current } = useSelector((s) => s.boards)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true)
        const { data } = await api.get(`/boards/${id}`)
        dispatch(setCurrentBoard(data))
      } catch (err) {
        setError('Board not found or access denied')
      } finally {
        setLoading(false)
      }
    }
    fetchBoard()
  }, [id, dispatch])

  if (loading) return (
    <>
      <Navbar />
      <div className="kanban-loading">Loading board...</div>
    </>
  )

  if (error) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6b778c' }}>
        <p>{error}</p>
        <button className="btn-create" style={{ marginTop: '1rem' }} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column',
      background: current?.background || '#0079bf' }}>
      <Navbar />
      <div className="board-topbar">
        <h2>{current?.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {current?.members?.map((m) => (
            <img key={m.user._id}
              src={m.user.avatar || `https://ui-avatars.com/api/?name=${m.user.name}&size=30&background=ffffff&color=0079bf`}
              alt={m.user.name} title={`${m.user.name} (${m.role})`}
              style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)' }} />
          ))}
        </div>
      </div>
      <KanbanBoard board={current} />
    </div>
  )
}

export default BoardPage
