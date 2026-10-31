import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import {
  socketTaskMoved, socketTaskCreated,
  socketTaskUpdated, socketTaskDeleted
} from '../store/slices/taskSlice';

const useSocket = (boardId, userId) => {
  const socketRef = useRef(null);
  const dispatch  = useDispatch();

  useEffect(() => {
    if (!boardId) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socketRef.current.emit('join-board', { boardId, userId });

    socketRef.current.on('task:moved',   (task)   => dispatch(socketTaskMoved(task)));
    socketRef.current.on('task:created', (task)   => dispatch(socketTaskCreated(task)));
    socketRef.current.on('task:updated', (task)   => dispatch(socketTaskUpdated(task)));
    socketRef.current.on('task:deleted', (taskId) => dispatch(socketTaskDeleted(taskId)));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [boardId, userId, dispatch]);

  const emitTaskMove = (task) => socketRef.current?.emit('task:move',   { boardId, task });
  const emitTaskCreate = (task) => socketRef.current?.emit('task:create', { boardId, task });
  const emitTaskUpdate = (task) => socketRef.current?.emit('task:update', { boardId, task });
  const emitTaskDelete = (taskId) => socketRef.current?.emit('task:delete', { boardId, taskId });

  return { emitTaskMove, emitTaskCreate, emitTaskUpdate, emitTaskDelete };
};

export default useSocket;
