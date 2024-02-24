import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import {
  errorHandlerMiddleware,
  notFound,
} from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log(`error: ${error.message}`.red.bold);
    process.exit(1);
  }
};
connectDb();

const app = express();

app.use(express.json()); // to accept json data in the body
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);

const server = app.listen(
  3000,
  console.log("Server is running on port 3000".yellow.bold)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room, user) => {
    socket.join(room);
    console.log(`userId "${user._id}" joined room: ${room}`);
  });

  socket.on("typing", (data) => io.to(data.recipientId).emit("typing", data));

  socket.on("stop typing", (data) =>
    io.to(data.recipientId).emit("stop typing", data)
  );

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
