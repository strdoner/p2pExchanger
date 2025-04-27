import { observer } from 'mobx-react-lite';
import React, {useState, useEffect, useRef} from 'react';

const CustomSelect = ({ options, size, selectedOption, setSelectedOption }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const selectRef = useRef(null);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setShowOptions(false);
        setFocusedOptionIndex(-1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    

    return (
        <div className={`custom-select ${size === undefined ? "select-sm" : "select-"+size}`} ref={selectRef}>  

            <button class="select-button" onClick={() => setShowOptions(!showOptions)}>
                <span class="selected-value">{selectedOption ? selectedOption.label : options[0].label}</span>
                <span class="arrow"></span>
            </button>
            <ul className={`select-dropdown ${showOptions ? "show" : ""}`}>
                {options.map((option, index) => (
                    <li key={option.value} className="option" onClick={() => handleSelect(option)}>
                        {option.label}
                    </li>
                ))}
            </ul>
        
        </div>
    )

}

export default observer(CustomSelect)