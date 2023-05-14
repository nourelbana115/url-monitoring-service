const cron = require('node-cron');
const { checkUrlAvailability } = require('../services/internal/checkService')


function runCheck(interval, check) {
    cron.schedule(`*/${interval} * * * *`, async () => {
        await checkUrlAvailability(check)
    })
}
module.exports = { runCheck };