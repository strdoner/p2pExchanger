import React from 'react'
import {observer} from 'mobx-react-lite'


const Button = ({children, btnType, ...props}) => {
    
    if (props.isloading) {
        return (
            <button {...props} className={`btn btn-${btnType} disabled d-flex justify-content-center`}>
                {children}
                <h5 style={{paddingLeft:"10px"}}><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></h5> 
            </button>
        )
    }
    else {
        return (
            <button {...props} className={`btn btn-${btnType}`}>
                {children}
            </button>
        )
    }
}

export default observer(Button)