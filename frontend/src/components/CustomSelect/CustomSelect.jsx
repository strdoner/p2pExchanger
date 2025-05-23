import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';

const CustomSelect = ({options, size, paramName, hasIcon}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [showOptions, setShowOptions] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const selectRef = useRef(null);

    // Получаем текущее значение из URL или используем первый вариант
    const currentValue = searchParams.get(paramName);

    // Находим выбранную опцию (если currentValue === null, вернется undefined)
    const selectedOption = options.find(opt => opt.label === currentValue);

    // Если selectedOption не найден (например, параметр удален), берем первую опцию
    const displayOption = selectedOption || options[0];

    const handleSelect = (option) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (option.label == null) {
            newSearchParams.delete(paramName);  // Удаляем параметр, если label === null
        } else {
            newSearchParams.set(paramName, option.label);
        }
        setSearchParams(newSearchParams);
        setShowOptions(false);
        setFocusedOptionIndex(-1);
    };

    // Остальной код без изменений
    useEffect(() => {
        const newValue = new URLSearchParams(location.search).get(paramName);
        if (newValue && newValue !== currentValue) {
            // Можно добавить дополнительную логику, если нужно
        }
    }, [location.search, paramName]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`custom-select ${size === undefined ? "select-sm" : "select-" + size}`} ref={selectRef}>
            <button className="select-button" onClick={() => setShowOptions(!showOptions)}>
                <span className="selected-value d-flex align-items-center">
                    {hasIcon ? (
                        <div className={`${displayOption.name.toLowerCase()}-bg rounded-3 me-1`}
                             style={{width: 15, height: 15}}></div>
                    ) : (
                        <></>
                    )}
                    {displayOption.name}
                </span>
                <span className="arrow"></span>
            </button>
            <ul className={`select-dropdown ${showOptions ? "show" : ""}`}>
                {options.map((option, index) => (
                    <li
                        key={option.value}
                        className={`d-flex option align-items-center ${option.label === currentValue ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        {hasIcon ? (
                            <div className={`${option.name.toLowerCase()}-bg rounded-3 me-1`}
                                 style={{width: 15, height: 15}}></div>
                        ) : (
                            <></>
                        )}
                        {option.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default observer(CustomSelect);