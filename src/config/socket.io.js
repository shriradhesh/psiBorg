const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    // Initialize Socket.io with the HTTP server
    io = new Server(server, {
        cors: {
            origin: '*', 
            methods: ['GET', 'POST' , 'PUT'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Listen for custom events (if needed)
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Emit events from other files
const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    } else {
        console.error('Socket.io not initialized');
    }
};

module.exports = { initSocket, emitEvent };
