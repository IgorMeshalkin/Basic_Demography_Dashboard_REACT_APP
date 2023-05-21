import React, {useEffect} from 'react';
import './SmartTable.css'
import {isOdd} from "../../utils/usefullFunctions";

const SmartTable = ({district}) => {

    useEffect(() => {
        console.log(district)
    }, [])

    return (<div className="stMain">
            <div className="stNamesContainer">
                {district.indicators.map(ind => <div
                    key={ind.name}
                    className={isOdd(ind, district.indicators) ? 'stNamesItem odd' : 'stNamesItem'}
                >
                    {ind.name}
                </div>)}
            </div>
            <div className="stValuesContainer">
                {district.indicators.map(ind => <div key={ind.name} className="stValueString">
                        <span
                            className={isOdd(ind, district.indicators) ? 'stValueItem odd' : 'stValueItem'}> {ind.year2019}</span>
                        <span
                            className={isOdd(ind, district.indicators) ? 'stValueItem odd' : 'stValueItem'}> {ind.year2020}</span>
                        <span
                            className={isOdd(ind, district.indicators) ? 'stValueItem odd' : 'stValueItem'}> {ind.year2021}</span>
                        <span
                            className={isOdd(ind, district.indicators) ? 'stValueItem odd' : 'stValueItem'}> {ind.year2022}</span>
                        <span
                            className={isOdd(ind, district.indicators) ? 'stValueItem odd' : 'stValueItem'}> {ind.year2023_1}</span>

                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartTable;