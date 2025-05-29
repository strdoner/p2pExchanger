import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

let stompClient = null;
let connectionPromise = null;

export const connect = (url, headers = {}) => {

    if (!connectionPromise) {
        connectionPromise = new Promise((resolve, reject) => {
            const socket = new SockJS(url);
            stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                connectHeaders: headers,
                onConnect: () => resolve(stompClient),
                onStompError: (frame) => reject(frame)
            });

            stompClient.activate();
        });
    }
    return connectionPromise;
};

export const disconnect = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        connectionPromise = null;
    }
};

export const getClient = () => stompClient;