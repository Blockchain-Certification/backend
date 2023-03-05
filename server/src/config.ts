import path from 'path';
const { env } = process;

// Mapper for environment variables
export const environment = env.NODE_ENV;
export const port = env.PORT;
export const timezone = env.TZ;
export const db = {
  URI: env.DB_URI || 'mongodb://localhost:27017/',
  minPoolSize: parseInt(env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(env.DB_MAX_POOL_SIZE || '10'),
};

export const mailer = {
  hostName: env.HOST_NAME || 'localhost',
  user: env.MAILER_EMAIL || '',
  password: env.MAILER_PASSWORD || '',
  hostFE: env.HOST_FRONTEND || '',
};

export const corsUrl = env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  issuer: env.TOKEN_ISSUER || '',
  audience: env.TOKEN_AUDIENCE || '',
  secret: env.TOKEN_SECRET || '',
};

export const logDirectory = env.LOG_DIR;

export const apiKey = env.API_KEY;

// hyperledger fabric
export const fabric = {
  ccpPath: env.CCP_PATH || '',
  walletPath: path.resolve(__dirname, '..', 'wallet') || '',
  channelName: env.FABRIC_CHANNEL_NAME || '',
  chaincodeName: env.FABRIC_CHAINCODE_NAME || '',
  enrollAdminName: env.FABRIC_ENROLL_ADMIN_NAME || 'admin',
  enrollAdminPassword: env.FABRIC_ENROLL_PASSWORD || 'adminpw',
};
