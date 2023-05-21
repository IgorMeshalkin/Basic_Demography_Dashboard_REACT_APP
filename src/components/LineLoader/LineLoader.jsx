import React from 'react';
import './LineLoader.css'

//Линейный индикатор загрузки.
const LineLoader = ({isSmall}) => {
    return (
        <div className={isSmall ? 'llMain small' : 'llMain'}>
            <div className={isSmall ? 'llRunner small' : 'llRunner'}/>
        </div>
    );
};

export default LineLoader;