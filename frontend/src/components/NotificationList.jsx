import ToastContainer from 'react-bootstrap/ToastContainer';
import Notification from "./Notification";
import {observer} from "mobx-react-lite";

function NotificationList({list}) {
    return (
        <ToastContainer className="mt-5 pe-5" position={"top-end"} style={{zIndex: 207770}}>

            {
                list?.map(item => (
                    <Notification notification={item} key={item.id}/>
                ))
            }
        </ToastContainer>
    );
}

export default observer(NotificationList);