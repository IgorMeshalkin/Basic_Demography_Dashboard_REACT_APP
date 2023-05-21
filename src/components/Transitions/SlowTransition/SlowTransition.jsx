import React, {useEffect, useRef, useState} from 'react';
import './SlowTransition.css'
import {CSSTransition} from "react-transition-group";

const SlowTransition = ({children}) => {
    const valueRef = useRef()
    const [transition, setTransition] = useState(true)
    const [value, setValue] = useState()

    useEffect(() => {
        setTransition(false)
        const timer = setTimeout(() => {
            setTransition(true)
            setValue(children)
        }, 250);
        return () => clearTimeout(timer);
    }, [children])

    return (
        <>
            <CSSTransition
                nodeRef={valueRef}
                timeout={500}
                classNames="alert"
                in={transition}
            >
                <div className="pvValue" ref={valueRef}>
                    {value}
                </div>
            </CSSTransition>
        </>
    );
};

export default SlowTransition;