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

let getUserName = (sender_psid) => {
    // Send the HTTP request to the Messenger Platform
    return new Promise((resolve, reject) => {
        request(
            {
                uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
                method: 'GET',
            },
            (err, res, body) => {
                console.log(body);
                if (!err) {
                    body = JSON.parse(body);
                    let userName = `${body.first_name} ${body.last_name}`;
                    console.log('message sent!');
                    resolve(userName);
                } else {
                    console.error('Unable to send message:' + err);
                    reject(err);
                }
            }
        );
    });
};
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userName = await getUserName(sender_psid);
            let response = {
                text: `Hello!, Welcome ${userName} to the Kunz's Application`,
            };
            await callSendAPI(sender_psid, response);
            resolve('done');
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    handleGetStarted: handleGetStarted,
};
