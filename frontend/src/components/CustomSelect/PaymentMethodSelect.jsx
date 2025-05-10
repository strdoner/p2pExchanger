import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";

const PaymentMethodSelect = ({options, setOption}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const [selectedValue, setSelectedValue] = useState(options[0]?.id ?? null);

    const selectRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === selectedValue) || options[0];

    const handleSelect = (option) => {
        setSelectedValue(option.id);
        console.log(option.id)
        setOption(option.id);
        setShowOptions(false);
        setFocusedOptionIndex(-1);
    };

    useEffect(() => {
        setOption(selectedOption.id)
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (!showOptions) {
            if (e.key === 'Enter' || e.key === ' ') {
                setShowOptions(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                setFocusedOptionIndex(prev =>
                    Math.min(prev + 1, options.length - 1)
                );
                e.preventDefault();
                break;
            case 'ArrowUp':
                setFocusedOptionIndex(prev => Math.max(prev - 1, 0));
                e.preventDefault();
                break;
            case 'Enter':
                if (focusedOptionIndex >= 0) {
                    handleSelect(options[focusedOptionIndex]);
                }
                e.preventDefault();
                break;
            case 'Escape':
                setShowOptions(false);
                setFocusedOptionIndex(-1);
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    return (
        <div
            className={`custom-select select-full`}
            ref={selectRef}
            tabIndex="0"
            onKeyDown={handleKeyDown}
        >
            <button
                className="select-button"
                onClick={() => setShowOptions(!showOptions)}
                aria-haspopup="listbox"
                aria-expanded={showOptions}
            >
                <span className="selected-value">
                    {selectedOption?.bankName}
                    <span className="secondary-text-color ps-2 small">**** **** **** {selectedOption?.lastFour}</span>
                </span>
                <span className="arrow"></span>
            </button>
            <ul
                className={`z-3 select-dropdown ${showOptions ? "show" : ""}`}
                role="listbox"
                aria-activedescendant={focusedOptionIndex >= 0 ? `option-${focusedOptionIndex}` : undefined}
            >
                {options.map((option, index) => (
                    <li
                        key={option.id}
                        id={`option-${index}`}
                        className={`option ${option.id === selectedValue ? 'selected' : ''} ${index === focusedOptionIndex ? 'focused' : ''}`}
                        onClick={() => handleSelect(option)}
                        role="option"
                        aria-selected={option.id === selectedValue}
                    >
                        {option.bankName}
                        <span className="secondary-text-color ps-2 small">**** **** **** {option.lastFour}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default observer(PaymentMethodSelect);