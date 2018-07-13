const notifiers = require("./notifiers");
const { notfier } = require("../config");
const { warn } = require("../logger");

let instance = null;

if (notfier.enabled && notifiers[notfier.type]) {
    instance = new notifiers[notfier.type](notfier.config);
} else {
    // Notifications will not be available for testing because we don't have
    // a running postgres instance
    warn(`notifier unknown or disabled: ${notfier.type}`);
}

exports.DEFAULT_CHANNEL = notfier.config.channel;

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
