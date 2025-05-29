import React from "react"

const MessageFileComponent = ({file, downloadHandler}) => {
    const fileType = file.fileName.slice(file.fileName.lastIndexOf(".") + 1)
    return (
        <div className="d-flex file align-items-center pe-3 rounded-3 mt-2">
            <div className=" p-2 rounded-3 me-2 file-icon text-center" style={{width: 45, height: 45}}
                 onClick={() => {
                     downloadHandler(file.id, file.fileName)
                 }}><span
                className="small">{fileType}</span>
            </div>
            <div className="text-truncate w-75">{file.fileName}</div>
            <div className="ms-2" onClick={() => {
                downloadHandler(file.id, file.fileName)
            }}>
                <i className="bi bi-download"></i>
            </div>

        </div>
    )
}

export default MessageFileComponent