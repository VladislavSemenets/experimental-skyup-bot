const config = require('./twilio');

module.exports.sendSms = (to, message) => {
    const client = require('twilio')(config.accountSid, config.authToken);

    client.messages
        .create({
            body: message,
            from: '+13343102846',
            to
        })
        .catch(message => console.log(message))
        .then(message => console.log(message.sid));
};
