import PGPubSub from "pg-pubsub";
import { postgresConfig } from "../config";
import { info } from "../logger";

const {
	database,
	username,
	port,
	host,
	password
} = postgresConfig;

const conStr = `postgres://${username}:${password}@${host}:${port}/${database}`;
let pubSubInstance = null;

/**
 * Init pubsub. To use the library you will need to use register
 * or push.
 */
export function init() {
	pubSubInstance = new PGPubSub(conStr);
	info("Postgres PubSub initialized");
}

/**
 * Gracefully shutdown the pubsub system.
 */
export const stop = () => {
	pubSubInstance.close();
};

/**
 * Register channels to listen for events
 * @param channel The channel name
 * @param cb The callback invoked when an event is published
 * on that channel
 */
export const register = (channel, cb) => {
	pubSubInstance.addChannel(channel, cb);
};

/**
 * Publish an event on a channel
 * @param channel The channel to publish the event on
 * @param payload Any javascript payload that the listener will
 * receive
 */
export const publish = (channel, payload) => {
	pubSubInstance.publish(channel, payload);
};