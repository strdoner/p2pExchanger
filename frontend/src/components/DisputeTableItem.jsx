import React from "react"
import {observer} from "mobx-react-lite";
import PaymentMethod from "./PaymentMethod";
import {Link} from "react-router-dom";

const DisputeTableItem = ({dispute}) => {
    return (
        <tr>
            <th>
                <span className="text-color fw-bolder">{dispute.id}</span>

            </th>
            <th>
                <span>{dispute.response.id}</span>
            </th>
            <th>
                <span className="text-color">{dispute.response.buyer.username}</span>
            </th>
            <th>
                <span className="text-color">{dispute.response.seller.username}</span>
            </th>
            <th>
                <div className='order__volume placeholder-glow'>
                    <p className={`text-color`}>{dispute.response.amount.toLocaleString()} {dispute.response.currency}</p>
                </div>
            </th>
            <th>
                <PaymentMethod name={dispute.status.name} color={dispute.status.color}/>
            </th>
            <th>
                04.10.2024
            </th>
            <th>
                <Link to={`/dispute/${dispute.id}`}>
                    <button className="btn btn-primary btn-sm">
                        <i className="bi bi-chat-left-text text-white pe-1"></i>
                        Открыть
                    </button>
                </Link>
            </th>
        </tr>
    )
}

export default observer(DisputeTableItem)