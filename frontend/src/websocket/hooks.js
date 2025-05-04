import { useEffect, useState } from 'react';
import { subscribe, unsubscribe } from './subscriptions';

export const useSubscription = (destination, callback, deps = []) => {
    useEffect(() => {
        try {
            const unsubscribeFn = subscribe(destination, (message) => {
                callback(JSON.parse(message.body));
            });
            return () => unsubscribeFn();
        } catch (e) {
            console.error(e);
        }



    }, [destination, ...deps]);
};

export const useWebSocketData = (destination, initialValue) => {
    const [data, setData] = useState(initialValue);

    useSubscription(destination, (message) => {
        setData(message);
    }, [destination]);

    return data;
};