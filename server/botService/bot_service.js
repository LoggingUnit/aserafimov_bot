// bot_service.js
var ObjectID = require('mongodb').ObjectID;
const rpn = require('request-promise-native');
const botCfg = require('../../config/botCfg');

module.exports = function (db) {
    function poll(lastUpdateId) {
        let requestUrl = createRequestUrlTelegram(botCfg, lastUpdateId);
        rpn(requestUrl)
            .then(updateJson => {
                let updateObj = JSON.parse(updateJson);
                if (!updateObj.result.length) {
                    poll(lastUpdateId);
                } else {
                    let nextUpdateId = updateObj.result[0].update_id + 1;
                    poll(nextUpdateId);
                    processMessages(updateObj.result[0].message, db, botCfg);
                }
            })
            .catch(err => console.log);
    }
    poll(0);
};

function processMessages(message, db, botCfg) {
    saveIncomingMessageToDb(message, db)
        .then(() => findWeatherForIncomingMessage(message, botCfg))
        .then(responseJson => JSON.parse(responseJson))
        .then(responseObj => createOutcomingMessage(responseObj, message))
        .then(outcomingMessage => sendOutcomingMessage(outcomingMessage, botCfg))
        .then(resultJson => JSON.parse(resultJson))
        .then(resultObj => saveOutcomingMessageToDb(resultObj, db))
        .catch(err => console.log);
}

function saveOutcomingMessageToDb(outcomingMessage, db) {
    console.log(outcomingMessage);
    return new Promise((resolve, reject) => {
        db.collection('responses').insert(outcomingMessage, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve('Saved to DB:', result);
            }
        });
    })
}

function sendOutcomingMessage(outcomingMessage, botCfg) {
    let responseUrlTelegram = createResponseUrlTelegram(outcomingMessage, botCfg);
    return rpn(responseUrlTelegram);
}

function createOutcomingMessage(weatherResponse, incomingMessage) {
    return new Promise((resolve, reject) => {
        let outcomingMessage;
        if (incomingMessage.text.search("/") !== -1) {
            outcomingMessage = {
                text: createOutcomingMessageText(),
                chat_id: incomingMessage.chat.id
            }
        } else {
            outcomingMessage = {
                text: createOutcomingMessageText(weatherResponse),
                chat_id: incomingMessage.chat.id
            }
        }
        if (outcomingMessage) {
            resolve(outcomingMessage);
        } else {
            reject(new Error('Something went wrong in createOutcomingMessage()'))
        }
    })
}

function createOutcomingMessageText(weatherResponse) {
    let text;
    if (weatherResponse) {
        if (!weatherResponse.count) {
            text = 'Requested city dont found'
        } else {
            text = `${weatherResponse.list[0].name} weather forecast for now:`
            for (key in weatherResponse.list[0].main) {
                text += `\n${key}:${weatherResponse.list[0].main[key]}`
            }
            text += `\n${weatherResponse.list[0].weather[0].description}`;
        }
    } else {
        text = `Hello, i am weather bot. I dont support any commands by now.
Just type city name to know the wheather forecast. Have a nice day.`
    }

    return text
}

function saveIncomingMessageToDb(message, db) {
    return new Promise((resolve, reject) => {
        db.collection('messages').insert(message, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve('Saved to DB:', result);
            }
        });
    })
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

function createRequestUrlTelegram(botCfg, offset) {
    let output = `${botCfg.BOT_ENDPOINT}${botCfg.BOT_API_KEY}/getUpdates?offset=${offset}`;
    for (var key in botCfg.requestOptionsTelegram) {
        output += `&${key}=${botCfg.requestOptionsTelegram[key]}`
    }
    return output;
}

function createRequestUrlWeather(requestedCity, botCfg) {
    let output = `${botCfg.WEATHER_ENDPOINT}${requestedCity}`;
    for (var key in botCfg.requestOptionsWeather) {
        output += `&${key}=${botCfg.requestOptionsWeather[key]}`
    }
    return encodeURI(output);
}

function createResponseUrlTelegram(outcomingMessage, botCfg) {
    let output = `${botCfg.BOT_ENDPOINT}${botCfg.BOT_API_KEY}/sendMessage?`;
    for (var key in outcomingMessage) {
        output += `${key}=${outcomingMessage[key]}&`
    }
    return encodeURI(output);
}