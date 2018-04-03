// bot_service.js
var ObjectID = require('mongodb').ObjectID;
const rpn = require('request-promise-native');
const teleCfg = require('../../config/teleCfg');

module.exports = function (db) {
    function poll(lastUpdateId) {
        let requestUrl = createRequestUrl(teleCfg, lastUpdateId);
        rpn(requestUrl)
            .then(updateJson => {
                let updateObj = JSON.parse(updateJson);
                if (!updateObj.result.length) {
                    poll(lastUpdateId);
                } else {
                    let nextUpdateId = updateObj.result[0].update_id + 1;
                    console.log(nextUpdateId);
                    poll(nextUpdateId);
                }
            })
            .catch(err => console.log);
    }
    poll(0);
};

function createRequestUrl(teleCfg, offset) {
    let output = `${teleCfg.BOT_ENDPOINT}${teleCfg.BOT_API_KEY}/getUpdates?offset=${offset}`;
    for (var key in teleCfg.requestOptions) {
        output += `&${key}=${teleCfg.requestOptions[key]}`
    }
    console.log(output);
    return output;
}



