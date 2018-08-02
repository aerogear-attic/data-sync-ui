const { log } = require("../logger");
const notifiers = require("./notifiers");
const { notifier } = require("../config");

let instance = null;
if (notifier.enabled && notifiers[notifier.type]) {
    instance = new notifiers[notifier.type](notifier.config);
} else {
    // Notifications will not be available for testing because we don't have
    // a running postgres instance
    log.warn(`notifier unknown or disabled: ${notifier.type}`);
}

exports.DEFAULT_CHANNEL = notifier.config.channel;

exports.publish = (channel, payload) => {
    if (instance) {
        instance.publish(channel, payload);
    }
};

exports.addChannel = (channel, onNotification) => {
    if (instance) {
        instance.addChannel(channel, onNotification);
    }
};

exports.stopNotifications = () => {
    if (instance) {
        instance.close();
    }
};
