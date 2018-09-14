const { log } = require("../logger");
const notifiers = require("./notifiers");
const { notifier } = require("../config");

let instance = null;
if (notifier.enabled && notifiers[notifier.type]) {
    instance = new notifiers[notifier.type](notifier.config);
} else {
    // Notifications will not be available for testing because we dont have
    // a running postgres instance
    log.warn(`notifier unknown or disabled: ${notifier.type}`);
}

function publish(channel, payload) {
    if (instance) {
        instance.publish(channel, payload);
    }
}

function addChannel(channel, onNotification) {
    if (instance) {
        instance.addChannel(channel, onNotification);
    }
}

function stopNotifications() {
    if (instance) {
        instance.close();
    }
}

module.exports = {

    DEFAULT_CHANNEL: notifier.config.channel,
    publish,
    addChannel,
    stopNotifications
};
