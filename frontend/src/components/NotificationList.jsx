import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Notification from "./Notification";

function StackingExample({list}) {
    return (
        <ToastContainer className="mt-5 pe-5" position={"top-end"} style={{ zIndex: 207770 }}>

            {
                list?.map(item => (
                    <Notification notification={item} key={item.id} />
                ))
            }
        </ToastContainer>
    );
}

export default StackingExample;