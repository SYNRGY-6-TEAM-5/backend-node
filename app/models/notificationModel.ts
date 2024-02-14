import { Model } from 'objection';

class ScheduledNotification extends Model {
  static get tableName() {
    return 'scheduled_notification';
  }

  static get idColumn() {
    return 'notification_id';
  }

  readonly notification_id!: number;
  time?: string;
  days?: number;
  notification?: Record<string, any>;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['time', 'days', 'notification'],

      properties: {
        notification_id: { type: 'integer' },
        time: { type: 'string' },
        days: { type: 'integer' },
        notification: { type: 'object' },
      },
    };
  }
}

export default ScheduledNotification;
