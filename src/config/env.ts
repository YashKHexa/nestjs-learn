export const DEFAULT_PORT = 3000;

export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  directUrl?: string;
}

export function parseEnvironment(
  environment: NodeJS.ProcessEnv,
): EnvironmentConfig {
  const portValue = environment.PORT ?? String(DEFAULT_PORT);
  const port = Number(portValue);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  const databaseUrl = environment.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  return {
    nodeEnv: environment.NODE_ENV?.trim() || 'development',
    port,
    databaseUrl,
    directUrl: environment.DIRECT_URL?.trim() || undefined,
  };
}

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  const parsed = parseEnvironment({
    NODE_ENV: toEnvironmentString(environment.NODE_ENV),
    PORT: toEnvironmentString(environment.PORT),
    DATABASE_URL: toEnvironmentString(environment.DATABASE_URL),
    DIRECT_URL: toEnvironmentString(environment.DIRECT_URL),
  });

  return {
    ...environment,
    NODE_ENV: parsed.nodeEnv,
    PORT: parsed.port,
    DATABASE_URL: parsed.databaseUrl,
    ...(parsed.directUrl ? { DIRECT_URL: parsed.directUrl } : {}),
  };
}

function toEnvironmentString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
