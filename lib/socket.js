import { Server } from "socket.io";


export function socketSetup(server){
    const io = new Server(server);

    const activeUsers=new Set()

    return (
        io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Example: when a logged-in user identifies themselves
    socket.on('user-login', (userId) => {
        activeUsers.add(userId);
        updateUserCount();
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        updateUserCount();
    });

    const updateUserCount = () => {
        // This is a simple count of active connections
        const count = io.sockets.adapter.clients().size; 
        io.emit('user-count', { count });
    };

    updateUserCount(); // Initial count
})
    )
}