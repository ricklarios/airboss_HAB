const {changeNL} = require('./changeNL');
const {requestNL} = require('./requestNL');
const {unsubscribeNL} = require('./unsubscribeNL');
const {validateEmail} = require('./validateNLMail');
const {validateUnsubscribeNL} = require('./validateUnsubscribeNL');

module.exports = {
    changeNL, requestNL, unsubscribeNL, validateEmail, validateUnsubscribeNL
}