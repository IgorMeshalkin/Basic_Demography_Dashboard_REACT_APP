import React, {useEffect, useRef, useState} from 'react';
import './DropDownList.css'
import DropDownOpenCloseButton from "./DropDownOpenCloseButton";
import DropDownListButton from "./DropDownListButton";

//Выпадающий список для формы заполнения данных
const DropDownList = ({list, setSelectedItem, dataIsChanged, activateDataLossWarning}) => {
    const leftSideRef = useRef();

    //Открыт ли список в настоящий момент
    const [isOpen, setIsOpen] = useState(false)

    //При каждом открытии/закрытии списка изменяется его размер.
    useEffect(() => {
        if (isOpen) {
            leftSideRef.current.setAttribute("style", "height: 60vh")
        } else {
            leftSideRef.current.setAttribute("style", "height: 35px")
            leftSideRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [isOpen])

    //Открывает/закрывает выпадающий список или предупреждает о не сохранённых данных.
    function openCloseList() {
        if (!dataIsChanged && !isOpen) {
            setIsOpen(true)
        } else if (isOpen) {
            setIsOpen(false)
        } else if (dataIsChanged) {
            activateDataLossWarning()
        }
    }

    //Делает "выбранным" пункт из списка и закрывает лист.
    function selectItem(item) {
        setSelectedItem(item)
        setIsOpen(false)
    }

    return (
        <div className="ddlMain">
            <div className={isOpen ? 'ddlLeftSide open' : 'ddlLeftSide'} ref={leftSideRef}>
                {
                    list.map(item =>
                        <DropDownListButton
                            key={item.id}
                            text={item}
                            isOpen={isOpen}
                            onClick={selectItem}
                        />
                    )
                }
            </div>
            <div className="ddlRightSide">
                <DropDownOpenCloseButton
                    onClick={openCloseList}
                    isOpen={isOpen}
                />
            </div>
        </div>
    );
};

export default DropDownList;