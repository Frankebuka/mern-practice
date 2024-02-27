import { errorHandler } from "../middleware/errorMiddleware.js";
import Notification from "../models/notificationModel.js";

const sendNotification = async (req, res, next) => {
  const { message } = req.body;
  if (!message)
    return next(errorHandler(400, "Invalid data passed into request"));
  try {
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
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

export { sendNotification, allNotification, deleteNotification };
