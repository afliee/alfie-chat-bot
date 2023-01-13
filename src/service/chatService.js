require('dotenv').config();
import request from 'request';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: 'https://graph.facebook.com/v9.0/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
}
const handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            response = { text: "Hello!, Welcome to the Kunz's Application" };
            await callSendAPI(sender_psid, response);
            resolve('done');
        } catch (err) {
            reject(err);
        }
    });
};

module.export = {
    handleGetStarted: handleGetStarted,
};
