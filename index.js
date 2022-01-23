const {app} = require('deta');

app.lib.cron(() => {
  console.log('cron');
});

module.exports = app;
