import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectWebSocket = (userId, onNotificationReceived) => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected to WebSocket');

        stompClient.subscribe(
            `/user/${userId}/queue/notifications`,
            (message) => {
                const notification = JSON.parse(message.body);
                console.log(notification);
                onNotificationReceived(notification);
            }
        );

        stompClient.subscribe(
            '/topic/notifications',
            (message) => {
                const notification = JSON.parse(message.body);
                onNotificationReceived(notification);
            }
        );
    };

    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
        console.error('WebSocket error:', frame.headers.message);
    };

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        console.log('WebSocket disconnected');
    }
};