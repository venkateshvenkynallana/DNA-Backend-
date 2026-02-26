import { Server } from "socket.io";
import { decodeToken } from "./utils.js";



export const onlineUsers=new Map();

let io;

export function socketSetup(server,app){
     io = new Server( server,{cors: {
    origin: "http://localhost:5173"
  }});


    io.on('connection', async(socket) => {

    try{
      console.log('User connected:', socket.id);
    const auth=socket.handshake.auth
    console.log("AUthhhh",auth)
    let userDetails
    console.log({auth:auth?.token})
    if(auth?.token.split(" ")[1]!=="null"){
     userDetails=await decodeToken({headers:{authorization:auth?.token}})

    }
    app.set("socket",socket)
    console.log({userDetails})
    onlineUsers.set(userDetails?.userId,socket.id)
    // Example: when a logged-in user identifies themselves
    // socket.on('user-login', (userId) => {
    //     // activeUsers.add(userId);
    //     updateUserCount();
    // });
    console.log("Online USerssss",onlineUsers)
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        updateUserCount();
    });

    const updateUserCount = () => {
        // This is a simple count of active connections
        const count = io.engine.clientsCount; 
        io.emit('user-count', { count });
    };

    updateUserCount(); // Initial count
    // io.listen(5000)
    }
    catch(err){
      console.log("Error in socketSetup",err)
    }
})

}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};