import { Server } from "socket.io";
import { decodeToken } from "./utils.js";
import cookie from "cookie"


export const onlineUsers=new Map();

let io;

export function socketSetup(server,app){
     io = new Server( server,{cors: {
    origin: ["http://localhost:5173", "https://dna-frontend-eosin.vercel.app"],
    credentials:true
  }});


  io.on('connection', async (socket) => {
    try {
      console.log('User connected:', socket.id);
      const auth = cookie.parse(socket.handshake.headers.cookie)

      console.log("AUthhhh", auth)
      let userDetails
      console.log({ auth: auth?.loginToken })
      if (auth?.loginToken) {
        userDetails = await decodeToken({ cookies: auth })

      }
      app.set("socket", socket)
      console.log({ userDetails })
      onlineUsers.set(userDetails?.userId, socket.id)
      // Example: when a logged-in user identifies themselves
      // socket.on('user-login', (userId) => {
      //     // activeUsers.add(userId);
      //     updateUserCount();
      // });
      console.log("Online USerssss", onlineUsers)
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (userDetails?.userId) {
          onlineUsers.delete(userDetails.userId);
        }
        updateUserCount();
      });

      const updateUserCount = () => {
        const count = onlineUsers.size;
        console.log("no of users in socket",count)
        io.emit('user-count', { count });
      };

      updateUserCount();
      // io.listen(5000)
    }
    catch (err) {
      console.log("Error in socketSetup", err)
    }
  })

}

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};