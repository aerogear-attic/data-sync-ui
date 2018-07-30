const PGPubSub = require("pg-pubsub");
const { log } = require("../../logger");

/**
 * A pubsub implementation that uses Postgres notify/listen feature and the
 * pg-pubsub lib (https://github.com/voxpelli/node-pg-pubsub)
 */
module.exports = class PostgresNotifier {

    constructor(config) {
        this.instance = new PGPubSub({
            user: config.username,
            host: config.host,
            database: config.database,
            password: config.password,
            port: config.port
        });
        log.info("Postgres notifier initialized");
    }

    /**
     * Publish `payload` on `channel`
     * @param channel (string) The channel name
     * @param payload (any) The payload
     */
    publish(channel, payload) {
        this.instance.publish(channel, payload);
        log.info(`published message to ${channel}`);
    }

    /**
     * Listen for notifications on `channel`
     * @param channel (string) The channel to listen to
     * @param onNotification (function) Callback invoked when a notification is received
     * on the channel
     */
    addChannel(channel, onNotification) {
        this.instance.addChannel(channel, onNotification);
        log.info(`listening for notifications on ${channel}`);
    }

    /**
     * Gracefully stop the notifications service
     */
    close() {
        this.instance.close();
    }

};
