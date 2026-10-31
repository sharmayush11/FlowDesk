const initSocket = (io) => {
  // Track online users: { socketId -> { userId, boardId } }
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Join a board room
    socket.on('join-board', ({ boardId, userId }) => {
      socket.join(boardId);
      onlineUsers.set(socket.id, { userId, boardId });
      // Tell everyone in room who is online
      io.to(boardId).emit('board:online-users',
        [...onlineUsers.values()]
          .filter(u => u.boardId === boardId)
          .map(u => u.userId)
      );
    });

    // Task moved (drag & drop)
    socket.on('task:move', ({ boardId, task }) => {
      socket.to(boardId).emit('task:moved', task);
    });

    // New task created
    socket.on('task:create', ({ boardId, task }) => {
      socket.to(boardId).emit('task:created', task);
    });

    // Task updated
    socket.on('task:update', ({ boardId, task }) => {
      socket.to(boardId).emit('task:updated', task);
    });

    // Task deleted
    socket.on('task:delete', ({ boardId, taskId }) => {
      socket.to(boardId).emit('task:deleted', taskId);
    });

    // Typing indicator on a task card
    socket.on('user:typing', ({ boardId, userId, taskId }) => {
      socket.to(boardId).emit('user:typing', { userId, taskId });
    });

    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        onlineUsers.delete(socket.id);
        io.to(user.boardId).emit('board:online-users',
          [...onlineUsers.values()]
            .filter(u => u.boardId === user.boardId)
            .map(u => u.userId)
        );
      }
    });
  });
};

module.exports = initSocket;
