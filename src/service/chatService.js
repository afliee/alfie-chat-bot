require('dotenv').config();
import request from 'request';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GETSTARTED =
    'https://alfie-chat-bot.onrender.com/images/1184206.jpg';
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
                    let userName = `${body.last_name} ${body.first_name}`;
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

            let responseText = {
                text: `Hello!, Welcome ${userName} to the Kunz's Application`,
            };

            let responseTemplate = sendGetStartedTemplate();

            await callSendAPI(sender_psid, responseText);
            await callSendAPI(sender_psid, responseTemplate);
            resolve('done');
        } catch (err) {
            reject(err);
        }
    });
};

let sendGetStartedTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Welcome!',
                        image_url: IMAGE_GETSTARTED,
                        subtitle: 'We have the fetures for everyone.',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Get Schedule Today',
                                payload: 'GET_SCHEDULE_NOW',
                            },
                            {
                                type: 'postback',
                                title: 'Set Up Account',
                                payload: 'SETUP_ACCOUNT',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};
module.exports = {
    handleGetStarted: handleGetStarted,
};
