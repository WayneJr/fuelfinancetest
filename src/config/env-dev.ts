const development = {
  DBNAME: process.env.DBNAME || 'finance',
  PORT: process.env.PORT || 3000,
  DBUSER: process.env.DBUSER,
  DBPASS: process.env.DBPASS,
  DBPORT: process.env.DBPORT,
  DBHOST: process.env.DBHOST,
  NODE_ENV: process.env.NODE_ENV || 'DEVELOPMENT',
};

export default development;
