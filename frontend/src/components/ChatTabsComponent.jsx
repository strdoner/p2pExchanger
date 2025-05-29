import React, {useState} from "react"
import {observer} from "mobx-react-lite";
import ChatComponent from "./ChatComponent";

const chatTabsComponent = ({contragents, responseId}) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [contragent, setContragent] = useState(contragents[0])
    const changeChatHandler = (contragent) => {
        setContragent(contragent);
    }

    return (
        <>
            <ul className="nav nav-tabs">
                {contragents.map((contr) => (
                    <li className="nav-item">
                        <p className={`nav-link ${contr.id === contragent.id ? "active" :""}`} aria-current="page" onClick={() => {changeChatHandler(contr)}}>{contr.username}</p>
                    </li>
                ))}

            </ul>
            <ChatComponent responseId={responseId} contragent={contragent} showHeader={false}/>
        </>
    )
}

export default observer(chatTabsComponent);