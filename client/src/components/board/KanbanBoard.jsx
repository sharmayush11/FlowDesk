import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchTasks, moveTask } from '../../store/slices/taskSlice';
import useSocket from '../../hooks/useSocket';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';

const KanbanBoard = ({ board }) => {
const dispatch = useDispatch();
const { items: tasks, loading } = useSelector((s) => s.tasks);
const { user } = useSelector((s) => s.auth);

const [addingColumn, setAddingColumn] = useState(null);
const [search, setSearch] = useState('');

const { emitTaskMove } = useSocket(board._id, user?._id);

useEffect(() => {
dispatch(fetchTasks(board._id));
}, [board._id, dispatch]);

const filteredTasks = useMemo(() => {
const query = search.trim().toLowerCase();


if (!query) return tasks;

return tasks.filter((task) =>
  task.title?.toLowerCase().includes(query)
);


}, [tasks, search]);

const tasksByColumn = (columnId) =>
filteredTasks
.filter((task) => task.columnId === columnId)
.sort((a, b) => a.order - b.order);

const onDragEnd = async (result) => {
const { destination, source, draggableId } = result;


if (!destination) return;

if (
  destination.droppableId === source.droppableId &&
  destination.index === source.index
) {
  return;
}

const result2 = await dispatch(
  moveTask({
    id: draggableId,
    columnId: destination.droppableId,
    order: destination.index,
  })
);

if (result2.payload) {
  emitTaskMove(result2.payload);
}


};

if (loading) {
return <div className="kanban-loading">Loading board...</div>;
}

return (
<> <div className="kanban-toolbar"> <div> <h3 className="kanban-toolbar-title">Board tasks</h3> <p className="kanban-toolbar-subtitle">
Search and organize your work </p> </div>


    <div className="task-search">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Search tasks..."
        aria-label="Search tasks by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button
          type="button"
          className="task-search-clear"
          aria-label="Clear task search"
          onClick={() => setSearch('')}
        >
          ×
        </button>
      )}
    </div>
  </div>

  {filteredTasks.length === 0 && search.trim() ? (
    <div className="task-search-empty">
      <h3>No matching tasks</h3>
      <p>Try another title or clear your search.</p>
      <button
        type="button"
        className="btn-create"
        onClick={() => setSearch('')}
      >
        Clear search
      </button>
    </div>
  ) : (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {[...board.columns]
          .sort((a, b) => a.order - b.order)
          .map((col) => (
            <div key={col._id} className="kanban-column">
              <div className="column-header">
                <h3 className="column-title">{col.title}</h3>
                <span className="task-count">
                  {tasksByColumn(col._id).length}
                </span>
              </div>

              <Droppable droppableId={col._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-tasks ${
                      snapshot.isDraggingOver ? 'drag-over' : ''
                    }`}
                  >
                    {tasksByColumn(col._id).map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TaskCard
                              task={task}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                className="add-task-btn"
                onClick={() => setAddingColumn(col._id)}
              >
                + Add a task
              </button>
            </div>
          ))}
      </div>
    </DragDropContext>
  )}

  {addingColumn && (
    <AddTaskModal
      boardId={board._id}
      columnId={addingColumn}
      onClose={() => setAddingColumn(null)}
    />
  )}
</>


);
};

export default KanbanBoard;
