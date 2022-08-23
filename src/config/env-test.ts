const test = {
  DBNAME: process.env.TEST_DBNAME || 'finance',
  PORT: process.env.TEST_PORT || 3000,
  DBUSER: process.env.TEST_DBUSER,
  DBPASS: process.env.TEST_DBPASS,
  DBPORT: process.env.TEST_DBPORT,
  DBHOST: process.env.TEST_DBHOST,
  NODE_ENV: process.env.TEST_NODE_ENV || 'test',
};

export default test;
