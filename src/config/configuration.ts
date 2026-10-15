import { parseEnvironment } from './env.js';

export default function configuration() {
  const environment = parseEnvironment(process.env);

  return {
    app: {
      nodeEnv: environment.nodeEnv,
      port: environment.port,
    },
    database: {
      url: environment.databaseUrl,
      directUrl: environment.directUrl,
    },
  };
}
