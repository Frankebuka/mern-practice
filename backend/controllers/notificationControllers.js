import { errorHandler } from "../middleware/errorMiddleware.js";
import Notification from "../models/notificationModel.js";

const sendNotification = async (req, res, next) => {
  const { message } = req.body;
  if (!message)
    return next(errorHandler(400, "Invalid data passed into request"));
  try {
    delete message._id;
    message.receiver = req.user.id;

    const notification = await Notification.create(message);
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

const allNotification = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user.id,
      unread: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const updateNotification = async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { unread: false },
    { new: true }
  );

  if (!notification) return next(errorHandler(404, "Notification Not Found"));

  res.json(notification);
};

export { sendNotification, allNotification, updateNotification };
