import {getClient} from "./connection";

const subscriptions = new Map();

export const subscribe = (destination, callback, headers = {}) => {
    const client = getClient();
    if (!client) throw new Error('STOMP connection not established');

    const sub = client.subscribe(destination, callback, headers);
    subscriptions.set(destination, sub);
    return () => unsubscribe(destination);
};

export const unsubscribe = (destination) => {
    const sub = subscriptions.get(destination);
    if (sub) {
        sub.unsubscribe();
        subscriptions.delete(destination);
    }
};

export const sendMessage = (destination, body, headers = {}) => {
    getClient()?.publish({
        destination,
        body: JSON.stringify(body),
        headers
    });
};