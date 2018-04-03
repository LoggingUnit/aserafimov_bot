// bot_service.js
var ObjectID = require('mongodb').ObjectID;
const rpn = require('request-promise-native');
const botCfg = require('../../config/botCfg');

module.exports = function (db) {
    console.log(botCfg.requestOptionsWeather);
    function poll(lastUpdateId) {
        let requestUrl = createRequestUrlTelegram(botCfg, lastUpdateId);
        rpn(requestUrl)
            .then(updateJson => {
                let updateObj = JSON.parse(updateJson);
                if (!updateObj.result.length) {
                    poll(lastUpdateId);
                } else {
                    processIncomingMessage(updateObj.result[0].message, db, botCfg);
                    let nextUpdateId = updateObj.result[0].update_id + 1;
                    poll(nextUpdateId);
                }
            })
            .catch(err => console.log);
    }
    poll(0);
};

function createRequestUrlTelegram(botCfg, offset) {
    let output = `${botCfg.BOT_ENDPOINT}${botCfg.BOT_API_KEY}/getUpdates?offset=${offset}`;
    for (var key in botCfg.requestOptionsTelegram) {
        output += `&${key}=${botCfg.requestOptionsTelegram[key]}`
    }
    return output;
}

function processIncomingMessage(message, db, botCfg) {
    saveIncomingMessageToDb(message, db);

    findWeatherForIncomingMessage(message, botCfg)
        .then(responseJson => {
            let responsObj = JSON.parse(responseJson);
            console.log(responsObj);
        })
        .catch(err => console.log);
}

function saveIncomingMessageToDb(message, db) {
    db.collection('messages').insert(message, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
}

function findWeatherForIncomingMessage(message, botCfg) {
    return new Promise((resolve, reject) => {
        let requestUrl = createRequestUrlWeather(message.text, botCfg);
        console.log(requestUrl);
        rpn(requestUrl)
            .then(result => resolve(result))
            .catch(err => reject(err));
    })
}

function createRequestUrlWeather(requestedCity, botCfg) {
    let output = `${botCfg.WEATHER_ENDPOINT}${requestedCity}`;
    for (var key in botCfg.requestOptionsWeather) {
        output += `&${key}=${botCfg.requestOptionsWeather[key]}`
    }
    return encodeURI(output);
}