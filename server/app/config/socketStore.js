const userSocketIDs = new Map();
const onlineUsers = new Set();

let io = null;

function setIO(ioInstance) {
  io = ioInstance;
}

function getIO() {
  return io;
}

module.exports = { userSocketIDs, onlineUsers, setIO, getIO };
