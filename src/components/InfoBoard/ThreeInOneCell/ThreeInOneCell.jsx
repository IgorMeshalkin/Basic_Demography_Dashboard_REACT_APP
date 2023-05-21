import React from 'react';
import './ThreeInOneCell.css'

//Компонет для расположения трёх значений в одной ячейке таблицы.
const ThreeInOneCell = ({first, second, third, isHeader, title, animationClass}) => {
    return (<div className={isHeader ? 'tioMain head' : 'tioMain'} title={title}>
                <span className={isHeader ? 'tioFirst head' : 'tioFirst'} title={first === 'ХК' ? 'Хабаровский край' : ''}>
                    <div className={animationClass}>
                    {first}
                    </div>
                </span>
        <span className={isHeader ? 'tioSecond head' : 'tioSecond'} title={second === 'ДФО' ? 'Дальневосточный федеральный округ' : ''}>
                <div className={animationClass}>
                {second}
                </div>
                </span>
        <span className={isHeader ? 'tioThird head' : 'tioThird'} title={third === 'РФ' ? 'Российская Федерация' : ''}>
                <div className={animationClass}>
                {third}
                </div>
                </span>
    </div>);
};

export default ThreeInOneCell;