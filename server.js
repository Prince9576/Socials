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
const { addUser, removeUser } = require("./utilsServer/roomActions");
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
    }, 10000);
  });

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
