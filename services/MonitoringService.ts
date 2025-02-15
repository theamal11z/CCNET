
import * as Sentry from '@sentry/react-native';
import { IS_PROD } from '../config/constants';

export class MonitoringService {
  static initialize() {
    if (IS_PROD) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000,
      });
    }
  }

  static captureError(error: Error) {
    if (IS_PROD) {
      Sentry.captureException(error);
    } else {
      console.error(error);
    }
  }
}
