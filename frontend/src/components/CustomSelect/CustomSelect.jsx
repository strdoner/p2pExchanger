import { observer } from 'mobx-react-lite';
import React, {useState, useEffect, useRef} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CustomSelect = ({ options, size, paramName }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [showOptions, setShowOptions] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const selectRef = useRef(null);
    

    // Получаем текущее значение из query-параметров или используем первое значение из options
    const currentValue = searchParams.get(paramName) || options[0].label;
    const selectedOption = options.find(opt => opt.label === currentValue) || options[0];

    const handleSelect = (option) => {
        // Обновляем query-параметр без полного перехода
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(paramName, option.label);
        setSearchParams(newSearchParams);
        setShowOptions(false);
        setFocusedOptionIndex(-1);
    };

    // Синхронизация при изменении URL (например, при нажатии назад/вперед)
    useEffect(() => {
        const newValue = new URLSearchParams(location.search).get(paramName);
        if (newValue && newValue !== currentValue) {
            // Значение уже обновится через currentValue
        }
    }, [location.search, paramName]);

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
            <button className="select-button" onClick={() => setShowOptions(!showOptions)}>
                <span className="selected-value">{selectedOption.label}</span>
                <span className="arrow"></span>
            </button>
            <ul className={`select-dropdown ${showOptions ? "show" : ""}`}>
                {options.map((option, index) => (
                    <li 
                        key={option.value} 
                        className={`option ${option.value === currentValue ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default observer(CustomSelect);