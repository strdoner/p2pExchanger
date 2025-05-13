import React, {useContext, useState} from "react";
import {observer} from "mobx-react-lite";
import Modal from "react-bootstrap/Modal";
import CustomFormSelect from "./CustomSelect/CustomFormSelect";
import Button from "react-bootstrap/Button";
import {Context} from "../index";

const ModalWindowDeposit = ({modalShow, setModalShow, getUserBalancesHandler}) => {
    const {store} = useContext(Context)
    const [balance, setBalance] = React.useState({});
    const [coin, setCoin] = useState("USDT")
    const [errors, setErrors] = React.useState({})
    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);

    var coinsTo = [
        {label: "USDT", value: "1", name: "USDT"},
        {label: "USDC", value: "2", name: "USDC"},
        {label: "ETH", value: "3", name: "ETH"},
        {label: "BTC", value: "4", name: "BTC"},
        {label: "BNB", value: "5", name: "BNB"},
    ]

    const createDepositHandler = () => {

        const response = store.createDeposit({currency: coin, ...balance})
        response.then((er) => {
            if (er.success) {
                console.log("deposited")
                getUserBalancesHandler()
            }
        })
    }

    return (
        <>
            <Modal
                show={modalShow}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Внести депозит
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="deal-confirmation">
                        <div className="mb-3">
                            <label htmlFor="currency" className="form-label">Криптовалюта</label>
                            <CustomFormSelect options={coinsTo} size={"full"} setOption={setCoin} initialValue={coin}/>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="price" className="form-label">Количество</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        placeholder="0.00"
                                        step="0.01"
                                        onChange={(e) => setBalance({...balance, amount: e.target.value})}
                                    />
                                    <span className="input-group-text">{coin}</span>
                                </div>

                            </div>


                            <div className={"danger-color"}>{errors?.amount}</div>
                        </div>
                        <div className={"danger-color"}>{errors?.server}</div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <div></div>
                    <div>
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Отменить
                        </Button>
                        <Button
                            variant={'primary'}
                            onClick={createDepositHandler}
                        >
                            Внести депозит
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default observer(ModalWindowDeposit);