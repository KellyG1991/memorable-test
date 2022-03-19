import { registerAs } from '@nestjs/config';

export default registerAs( 'logger', () => ( {
  slack: {
    baseUrl: process.env.LOGGER_SLACK_BASE_URL,
    route: process.env.LOGGER_SLACK_ROUTE,
    level: process.env.LOGGER_SLACK_LEVEL,
  },
} ) );
