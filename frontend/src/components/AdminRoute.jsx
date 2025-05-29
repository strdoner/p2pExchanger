import {Context} from "../index";
import {useContext} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {observer} from "mobx-react-lite";

const PrivateRoute = (props) => {
    const {store} = useContext(Context)

    if (!store.isAdmin) {
        return <Navigate to="/login"/>
    } else {
        return <Outlet/>
    }
}

export default observer(PrivateRoute)