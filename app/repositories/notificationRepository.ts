import ScheduledNotification from "../models/notificationModel";

class NotificationRepository {
  create(createArgs: any) {
    return ScheduledNotification.query().insert(createArgs);
  }
}

export default new NotificationRepository();