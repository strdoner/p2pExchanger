import {useContext, useEffect, useState} from 'react';
import {subscribe} from './subscriptions';
import {Context} from "../index";

export const useSubscription = (destination, callback, deps = []) => {
    const {store} = useContext(Context)
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