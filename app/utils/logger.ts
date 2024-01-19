import pino from 'pino';
import dayjs from 'dayjs';
import pinoPretty from 'pino-pretty';

const logger = pino({
  prettifier: pinoPretty,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
});

export default logger;
