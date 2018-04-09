/**
 * bot_service.js
 * Serves bots request routing 
 */

var ObjectID = require('mongodb').ObjectID;
const rpn = require('request-promise-native');
const botCfg = require('../../config/botCfg');

module.exports = function (db) {
    /**
     * Function provides long polling of Telegram API
     * Fist time it called with argument 0, so all unread messages from API server will be received.
     * Next calls performed with lastUpdateId+1 as argument to get only new messages.
     * All the times some update is received processMessages function is called.
     * In case of no updates received after last call function will be called with
     * same lastUpdateId argument. 
     * No return - infinity loop.
     * @param {number} lastUpdateId id of last received update
     */
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
            .catch(err => console.log(err));
    }
    poll(0);
};

/**
 * Function provides sequential call of message processing promises
 * @param {Object} message 
 * @param {Object} db 
 * @param {Object} botCfg 
 */
function processMessages(message, db, botCfg) {
    saveIncomingMessageToDb(message, db)
        .then(() => findWeatherForIncomingMessage(message, botCfg))
        .then(responseJson => JSON.parse(responseJson))
        .then(responseObj => createOutcomingMessage(responseObj, message))
        .then(outcomingMessage => sendOutcomingMessage(outcomingMessage, botCfg))
        .then(resultJson => JSON.parse(resultJson))
        .then(resultObj => saveOutcomingMessageToDb(resultObj, db))
        .catch(err => {
            console.log(err);
            createOutcomingErrorMessage(err, message)
                .then(outcomingMessage => sendOutcomingMessage(outcomingMessage, botCfg))
                .then(resultJson => JSON.parse(resultJson))
                .then(resultObj => saveOutcomingMessageToDb(resultObj, db))
        });
}

/**
 * Methods makes GET request to OpenWeatherMap API to forecast for city in 'text' field of received message
 * @param {Object} message regular Telegram API message Object from user 
 * @param {Object} botCfg config file
 * @returns {Promise} Promise object that represents JSON weather forecast for city in message
 */
function findWeatherForIncomingMessage(message, botCfg) {
    return new Promise((resolve, reject) => {
        let requestUrl = createRequestUrlWeather(message.text, botCfg);
        console.log(requestUrl);
        rpn(requestUrl)
            .then(result => resolve(result))
            .catch(err => reject(err));
    })
}

/**
 * Method creates outcoming message according to input data
 * @param {Object} weatherResponse object with weather forecast
 * @param {Object} incomingMessage regular Telegram API message Object from user
 * @returns {Promise} Promise object that represents regular Telegram API message
 */
function createOutcomingMessage(weatherResponse, incomingMessage) {
    return new Promise((resolve, reject) => {
        let outcomingMessage;
        //if "/" symbol found in message it expected to be a command, 
        //appropriate response will be added in called function
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

/**
 * Function creates outcoming message text according to input data
 * In case no argument provided it is expected that dummy text have to be returned
 * @param {Object} weatherResponse object with weather forecast
 * @returns {string} text according to input data
 */
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

/**
 * Function returns a promise to send data back to client
 * @param {Object} outcomingMessage regular Telegram API message Object ready to send
 * @param {Object} botCfg config file
 * @returns {Promise} promise object to send data back to client
 */
function sendOutcomingMessage(outcomingMessage, botCfg) {
    let responseUrlTelegram = createResponseUrlTelegram(outcomingMessage, botCfg);
    return rpn(responseUrlTelegram);
}

/**
 * Method creates outcoming message according to input data in case of error
 * @param {Object} error object containing error details
 * @param {Object} incomingMessage regular Telegram API message Object from user
 * @returns {Promise} Promise object that represents regular Telegram API message
 */
function createOutcomingErrorMessage(error, incomingMessage) {
    return new Promise((resolve, reject) => {
        let outcomingMessage = {
            text: createOutcomingErrorMessageText(error),
            chat_id: incomingMessage.chat.id
        }
        resolve(outcomingMessage);
    })
}

/**
 * Function creates outcoming message text according to input data in case of error
 * @param {Object} error object with error details
 * @returns {string} text according to input data
 */
function createOutcomingErrorMessageText(error) {
    let text = error;
    return text;
}

/**
 * Method receives user input message as argument and return promise to add it into db
 * @param {Object} message regular Telegram API message Object from user 
 * @param {Object} db object that represents database
 * @returns {Promise} Promise object that represents regular Telegram API message added to db
 */
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

/**
 * Method receives user outgoind message as argument and return promise to add it into db
 * @param {Object} outcomingMessage regular Telegram API message Object to user 
 * @param {Object} db object that represents database
 * @returns {Promise} Promise object that represents regular Telegram API message added to db
 */
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

/**
 * Function creates URL for Telegram request according to input data
 * @param {Object} botCfg config file
 * @param {number} offset Telegram API parameter represented as last update id + 1
 * @returns {string} output string ready to be sent as http GET request 
 */
function createRequestUrlTelegram(botCfg, offset) {
    let output = `${botCfg.BOT_ENDPOINT}${botCfg.BOT_API_KEY}/getUpdates?offset=${offset}`;
    for (var key in botCfg.requestOptionsTelegram) {
        output += `&${key}=${botCfg.requestOptionsTelegram[key]}`
    }
    return output;
}

/**
 * Function creates URL for OpenWeatherMap request according to input data
 * @param {string} requestedCity string represents city to request
 * @param {Object} botCfg config file
 * @returns {string} output URI encoded string ready to be sent as http GET request
 */
function createRequestUrlWeather(requestedCity, botCfg) {
    let output = `${botCfg.WEATHER_ENDPOINT}${requestedCity}`;
    for (var key in botCfg.requestOptionsWeather) {
        output += `&${key}=${botCfg.requestOptionsWeather[key]}`
    }
    return encodeURI(output);
}

/**
 * Function creates URL for Telegram response according to input data
 * @param {Object} outcomingMessage regular Telegram API message Object to user 
 * @param {Object} botCfg config file
 * @returns {string} output URI encoded string ready to be sent as http GET request
 */
function createResponseUrlTelegram(outcomingMessage, botCfg) {
    let output = `${botCfg.BOT_ENDPOINT}${botCfg.BOT_API_KEY}/sendMessage?`;
    for (var key in outcomingMessage) {
        output += `${key}=${outcomingMessage[key]}&`
    }
    return encodeURI(output);
}