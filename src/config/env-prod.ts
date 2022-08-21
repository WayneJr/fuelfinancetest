const production = {
  DBNAME:
    process.env.DBNAME ||
    'mongodb+srv://bishop:bishop@restfulcluster.creso.mongodb.net/ajolity?retryWrites=true&w=majority',
  PORT: process.env.PORT || 3000,
  DBUSER: process.env.JWT_SECRET || 'hasta la vista',
  DBPASS: process.env.CLOUD_NAME,
  DBPORT: process.env.API_KEY,
  DBHOST: process.env.API_SECRET,
  NODE_ENV: process.env.REDIS_HOST || 'localhost',
};
export default production;
