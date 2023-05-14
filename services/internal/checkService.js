const axios = require('axios');
const CheckResults = require('../../models/CheckResult');
const Check = require('../../models/Check');
const { sendMail } = require('../mailService')
const { runCheck } = require('../cronService')


async function checkUrlAvailability(check) {
    try {
        let start = performance.now();
        const response = await axios.get(check.url)
        let end = performance.now()

        await new CheckResults({
            url: check.url,
            status: response.status,
            responseTime: end - start
        }).save();
    } catch (error) {
        await new CheckResults({
            url: check.url,
            status: error.response ? error.response.status : null,
            responseTime: end - start
        }).save();
        //notify
        await sendMail("Bosta", ["bosta@bosta.com"], "attention!!!", "your site is down!!!");
    }
}

async function loadCheckJobs() {
    try {
        const checks = await Check.find();
        for (let check of checks) {
            runCheck(check.interval, check);
        }
    } catch (error) {
        console.log(error)
    }

}


module.exports = { checkUrlAvailability, loadCheckJobs };