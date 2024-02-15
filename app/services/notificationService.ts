import scheduleLib from "node-schedule";
import firebaseAdmin from "../firebaseAdmin";
import NotificationRepository from "../repositories/notificationRepository";
import UserRepository from "../repositories/userRepository";

class ScheduleService {
    async createSchedule(user_id: string, data: any) {
        try {
            const scheduledNotification = await NotificationRepository.create({
                time: data.time,
                days: data.days[0],
                notification: {
                    title: data.title,
                    body: data.body,
                },
            });

            const dayOfWeek = data.days.join(",");
            const timeToSent = data.time.split(":");
            const hours = timeToSent[0];
            const minutes = timeToSent[1];
            const scheduleId = scheduledNotification.notification_id.toString();
            const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;

            scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
                try {
                    const user = await UserRepository.findById(user_id);
                    const userFcmToken = user?.fcm_token;

                    if (!userFcmToken) {
                        throw new Error("User FCM token not found");
                    }

                    const payload = {
                        token: userFcmToken,
                        title: data.title,
                        body: data.body,
                    };

                    await firebaseAdmin.sendUnicastNotification(payload);
                } catch (error) {
                    console.error("Error sending notification:", error);
                }
            });
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }
    async sendDirectNotification(user_id: string, data: any) {
        try {
            const user = await UserRepository.findById(user_id);
            const userFcmToken = user?.fcm_token;

            if (!userFcmToken) {
                throw new Error("User FCM token not found");
            }

            const payload = {
                token: userFcmToken,
                title: data.title,
                body: data.body,
            };

            await firebaseAdmin.sendUnicastNotification(payload);
        } catch (error) {
            console.error("Error sending direct notification:", error);
            throw error;
        }
    }
}

export default new ScheduleService();
