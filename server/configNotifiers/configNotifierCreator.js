import { notifiers } from "./notifiers";
import { notfier as config } from "../config";
import { warn } from "../logger";

let instance = null;

if (config.enabled && notifiers[config.type]) {
    instance = new notifiers[config.type](config.config);
} else {
    // Notifications will not be available for testing because we don't have
    // a running postgres instance
    warn(`notifier unknown or disabled: ${config.type}`);
}

export const publish = (channel, payload) => {
    if (instance) {
        instance.publish(channel, payload);
    }
};

export const addChannel = (channel, onNotification) => {
    if (instance) {
        instance.addChannel(channel, onNotification);
    }
};

export const close = () => {
    if (instance) {
        instance.close();
    }
};
