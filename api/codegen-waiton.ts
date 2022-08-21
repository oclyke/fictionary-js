var waitOn = require('wait-on');
async function run() {
  var opts = {
    resources: [
      'http-get://localhost:4001/',
    ],
    headers: {
      'accept': 'text/html'
    },
    // verbose: true,
  };
  console.log('waiting for graphql server...')
  await waitOn(opts);
}
run()
