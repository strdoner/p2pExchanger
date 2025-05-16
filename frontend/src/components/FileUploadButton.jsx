import React, {useRef} from "react"

const FileUploadButton = ({onFileSelect}) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div>
            <button
                onClick={handleButtonClick}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                }}
                title="Прикрепить файл"
            >
                <i className="bi bi-paperclip"></i>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
            />
        </div>
    );
};

export default FileUploadButton;