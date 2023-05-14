const Check = require('../models/Check');
const CheckResults = require('../models/CheckResult');
const { runCheck } = require('../services/cronService')



async function createCheck(req, res) {
    try {
        req.body.url = generateUrl(req.body);
        req.body.senderConfigs = generateSendConfigs(req.body);
        req.body.ownerId = req.user._id;
        const newCheck = await new Check(req.body).save();
        runCheck(newCheck.interval)
        res.send(newCheck);
    } catch (error) {
        console.log(error)
    }
}

async function getCheck(req, res) {
    try {
        const check = await Check.find({ _id: req.params.id, ownerId: req.user._id });
        if (!check) return res.status(401).send("you dont have check with this id");
        res.send(check);
    } catch (error) {
        res.send(error);
    }
}

async function deleteCheck(req, res) {
    try {
        const check = await Check.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
        if (!check) return res.status(401).send("you dont have check with this id");
        res.send("check deleted successfully");
    } catch (error) {
        res.send(error)
    }
}

async function createReport(req, res) {
    const results = await CheckResults.find(req.params.url).sort({ checkedAt: 1 }).lean().exec();
    if (results.length === 0) {
        return res.status(404).send({ error: 'No results found for this URL' });
    }

    const totalChecks = results.length;
    const totalUptime = results.filter(r => r.status >= 200 && r.status < 400).length;
    const totalDowntime = totalChecks - totalUptime;
    const totalResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0);

    const report = {
        status: results[results.length - 1].status,
        availability: (totalUptime / totalChecks) * 100,
        outages: totalDowntime,
        downtime: totalDowntime * 10 / 1000,
        uptime: totalUptime * 10 / 1000,
        responseTime: totalResponseTime / totalChecks,
        history: results
    };

    res.send(report);
}


function generateUrl(urlOptions) {
    const { port, path, protocol, url } = urlOptions;
    let generatedUrl = `${protocol.toLowerCase()}://${url}`;
    generatedUrl += (port) ? `:${port}/` : '';
    generatedUrl += (path) ? `${path}` : '';
    return generatedUrl;
}

function generateSendConfigs(configs) {
    const { user } = configs
    let senderConfigs = { "email": user?.email }
    return senderConfigs
}

module.exports = { createCheck, createReport, getCheck, deleteCheck };