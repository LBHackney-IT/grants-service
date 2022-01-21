const fs = require('fs');
const { Client } = require('pg');

module.exports.clearDatabase = async () => {
  const clearSql = (await fs.promises.readFile('db/clear-data.sql')).toString();

  const client = new Client({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
  });

  await client.connect();

  await client.query(clearSql);

  await client.end();
};
