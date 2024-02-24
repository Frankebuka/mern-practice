import { errorHandler } from "../middleware/errorMiddleware.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

const sendMessage = async (req, res, next) => {
  const { chatId, content, pic } = req.body;

  if (!chatId || (!content && !pic))
    return next(errorHandler(400, "Invalid data passed into request"));

  var newMessage = {
    sender: req.user._id,
    content,
    pic,
    unread: true,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username pic");
    message = await message.populate("chat");
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });
    message = await message.populate({
      path: "chat",
      populate: [{ path: "latestMessage", select: "_id" }],
    });

    message = await User.populate(message, {
      path: "chat.users",
      select: "username pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const allMessage = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const updatedMessage = async (req, res, next) => {
  const { messageId, chatId } = req.body;

  const message = await Message.findByIdAndUpdate(
    messageId,
    { unread: false },
    { new: true }
  );

  if (!message) return next(errorHandler(404, "Message Not Found"));

  const chatUpdated = await Chat.findByIdAndUpdate(
    chatId,
    { latestMessage: message },
    { new: true }
  )
    .populate("users")
    .populate("groupAdmin")
    .populate({
      path: "latestMessage",
      populate: [{ path: "sender", select: "username pic email" }],
    });

  if (!chatUpdated) return next(errorHandler(404, "Chat Not Found"));

  res.json(chatUpdated);
};

export { sendMessage, allMessage, updatedMessage };
