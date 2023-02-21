import path from 'path';
// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TZ;

export const db = {
  URI: process.env.DB_URI || 'mongodb://localhost:27017/',
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};

export const logDirectory = process.env.LOG_DIR;

export const apiKey = process.env.API_KEY;

// hyperledger fabric
export const fabric = {
  ccPath: process.env.CCP_PATH || '',
  walletPath: path.resolve(__dirname, '..', 'wallet') || '',
  channelName: process.env.FABRIC_CHANNEL_NAME || '',
  chaincodeName: process.env.FABRIC_CHAINCODE_NAME || '',
  enrollAdminName : process.env.FABRIC_ENROLL_ADMIN_NAME || 'admin',
  enrollAdminPassword : process.env.FABRIC_ENROLL_PASSWORD || 'adminpw',
};
