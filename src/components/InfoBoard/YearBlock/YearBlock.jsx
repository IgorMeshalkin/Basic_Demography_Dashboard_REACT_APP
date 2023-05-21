import React from 'react';
import './YearBlock.css'
import Arrow from "../../UI/Arrow/Arrow";
import {getPeriodName} from "../../../utils/usefullFunctions";
import ThreeInOneCell from "../ThreeInOneCell/ThreeInOneCell";

const YearBlock = ({
                       firstPeriod,
                       secondPeriod,
                       thirdPeriod,
                       isFirst,
                       isLast,
                       isKhabKray,
                       onArrowClick,
                       animationClass
                   }) => {
    return (
        <div className="ybMain">
            <div className={isKhabKray ? 'ybLeft big' : 'ybLeft'}>
                <Arrow
                    direction={'left'}
                    isVisible={!isFirst}
                    onClick={onArrowClick}
                />
            </div>
            <div className={isKhabKray ? 'ybCenter' : 'ybCenter big'}>
                {
                    isKhabKray ?
                        <div className={animationClass}>
                            {getPeriodName(thirdPeriod)}
                        </div> :
                        <ThreeInOneCell
                            first={getPeriodName(firstPeriod)}
                            second={getPeriodName(secondPeriod)}
                            third={getPeriodName(thirdPeriod)}
                            isHeader={false}
                            animationClass={animationClass}
                        />
                }
            </div>
            <div className={isKhabKray ? 'ybRight big' : 'ybRight'}>
                <Arrow
                    direction={'right'}
                    isVisible={!isLast}
                    onClick={onArrowClick}
                />
            </div>
        </div>
    );
};

export default YearBlock;