const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports.handler = async () => {
  const output1 = await exec('ls node_modules/.bin/');
  const output2 = await exec('ls db/migrations/');

  console.warn(output1.stdout);
  console.warn(output2.stdout);

  const output = await exec(
    "node_modules/.bin/db-migrate --migrations-dir 'db/migrations/' up"
  );

  console.log(output.stdout);

  if (output.stderr) console.error(output.stderr);

  return true;
};
