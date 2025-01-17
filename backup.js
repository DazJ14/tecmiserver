io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);
  
    socket.on("joinServer", (username) => {
      const user = {
        username,
        id: socket.id
      }
      users.push(user)
      io.emit("newUser", users)
    })
  
    socket.on("joinChannel", (channelName, callback) => {
      socket.join(channelName);
      callback(messages[channelName])
      console.log(`User joined channel: ${channelName}`);
      // socket.emit("joined", messages[channelName])
    });
  
    socket.on("sendMessage", ({ content, to, sender, chatName, isChannel }) => {
      if (isChannel) {
        const payload = {
          content,
          chatName,
          sender
        }
  
        socket.to(to).emit("newMessage", payload)
      } else {
        const payload = {
          content,
          chatName: sender,
          sender
        }
  
        socket.to(to).emit("newMessage", payload)
      }
  
      if (messages[chatName]) {
        messages[chatName].push({
          sender,
          content
        })
      }
    });
  
    socket.on("disconnect", () => {
      users = users.filter(user => user.id !== socket.id)
      io.emit("newUser", users)
      console.log("User disconnected:", socket.id);
    });
  });