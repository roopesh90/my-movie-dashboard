// Version is managed in package.json
// Update this when running npm version commands
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'movie-dashboard';

export function getVersionInfo() {
  return {
    version: APP_VERSION,
    name: APP_NAME,
    buildTime: process.env.BUILD_TIME || 'development',
    environment: process.env.NODE_ENV || 'development',
  };
}

export function logVersion() {
  const info = getVersionInfo();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🎬 ${info.name.toUpperCase()} v${info.version}`);
  console.log(`📦 Environment: ${info.environment}`);
  console.log(`🕐 Build Time: ${info.buildTime}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
