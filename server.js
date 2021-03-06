const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");
const {
  addUser,
  removeUser,
  findConnectedUser,
} = require("./utilsServer/roomActions");
const {
  loadMessages,
  sendNewMessage,
  setMsgToUnread,
} = require("./utilsServer/messageActions");
const PORT = process.env.PORT || 3000;
connectDb();
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("join", async ({ userId }) => {
    const users = await addUser(userId, socket.id);
    setInterval(() => {
      socket.emit("connectedUsers", {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 1000);
  });

  socket.on("loadMessages", async ({ userId, messagesWith }) => {
    console.log("Load Messages", { userId, messagesWith });
    const { chat, error } = await loadMessages(userId, messagesWith);
    console.log("Load Messages Info", { chat, error });
    if (!error) {
      socket.emit("messagesLoaded", { chat });
    } else {
      if (error === "No_Chat_found") {
        socket.emit("noChatFound");
      }
    }
  });

  socket.on("sendNewMsg", async ({ userId, receiverUserId, msg }) => {
    console.log("Message Trigger 1", { userId, receiverUserId });
    const { newMsg, error } = await sendNewMessage({
      userId,
      receiverUserId,
      msg,
    });

    const receiverSocket = findConnectedUser(receiverUserId);
    console.log("Message Trigger 2", { newMsg, receiverSocket });
    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
    } else {
      await setMsgToUnread(receiverUserId);
    }

    !error && socket.emit("messageSent", { newMsg });
  });

  socket.on(
    "sendNewMessageFromPopup",
    async ({ userId, receiverUserId, msg }) => {
      const { newMsg, error } = await sendNewMessage({
        userId,
        receiverUserId,
        msg,
      });

      const receiverSocket = findConnectedUser(receiverUserId);
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
      } else {
        await setMsgToUnread(receiverUserId);
      }

      !error && socket.emit("messageSentFromPopup", { newMsg });
    }
  );

  socket.on("disconnect", async () => {
    await removeUser(socket.id);
  });
});

nextApp.prepare().then(() => {
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/login", require("./api/login"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/notifications", require("./api/notifications"));
  app.use("/api/chats", require("./api/chats"));
  app.all("*", (req, res) => handle(req, res));
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Server started at port : ", PORT);
  });
});
