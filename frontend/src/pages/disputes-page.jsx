import React from "react"
import {observer} from "mobx-react-lite";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import P2pOrdersHistory from "../components/P2pOrdersHistory";
import Footer from "../components/Footer/Footer";
import DisputesTable from "../components/DisputesTable";

const disputesPage = () => {

    var status = [
        {label: null, value: "1", name: "Все статусы"},
        {label: "OPEN", value: "2", name: "Открыт"},
        {label: "RESOLVED", value: "3", name: "Завершен"},

    ]


    return (
        <>
            <div className='container'>
                <div className='row history_filters mt-5 pt-5'>
                    <div className="col-3">
                        <p>Статус</p>
                        <CustomSelect options={status} size={"full"} paramName="status"/>
                    </div>

                </div>
                <div style={{minHeight: 590}}>
                    <DisputesTable/>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default observer(disputesPage);