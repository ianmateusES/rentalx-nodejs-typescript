export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expiresIn: '15m',
    secret_refresh_token: process.env.APP_SECRET_REFRESH || 'default',
    expires_in_refresh_token: '30d',
    expires_refresh_token_days: 30,
  },
};
