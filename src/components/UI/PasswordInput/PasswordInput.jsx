import React from 'react';
import './PasswordInput.css'
const PasswordInput = ({setPassword, keyPress}) => {
    function handleChange(event) {
        setPassword(event.target.value)
    }

    return (
        <div className="passiMain">
            <input
                type="password"
                onChange={handleChange}
                className="passiInput"
                onKeyPress={(event) => keyPress(event)}
            />
        </div>
    );
};

export default PasswordInput;