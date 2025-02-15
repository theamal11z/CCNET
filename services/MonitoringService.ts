
import * as Sentry from 'sentry-expo';
import { IS_PROD } from '../config/constants';

export class MonitoringService {
  static initialize() {
    if (IS_PROD) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        enableInExpoDevelopment: true,
        debug: !IS_PROD
      });
    }
  }

  static captureError(error: Error) {
    if (IS_PROD) {
      Sentry.Native.captureException(error);
    } else {
      console.error(error);
    }
  }
}
