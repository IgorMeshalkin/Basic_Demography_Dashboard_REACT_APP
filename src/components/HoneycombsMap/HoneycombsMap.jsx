import React from 'react';
import Honeycomb from "../Honeycomb/Honeycomb";
import './HoneycombsMap.css'
import BigHoneycomb from "../BigHoneycomb/BigHoneycomb";

//Карта сот. Отвечает за положение сот относительно друг друга.
const HoneycombsMap = ({DistrictsList, selectDistricts, selectedDistricts}) => {
    const getClassName = (number) => {
        return "container" + number;
    }

    return (
        <div className="hcmMain">
            {
                DistrictsList
                    .filter(district => district.Id !== 2 && district.Id !== 3) //Исключаю ДФО и РФ из списка. Их не должно быть в сотах
                    .map(district =>
                        <div className={getClassName(district.Id)} key={district.Id}>
                            {
                                district.Id === 1 ?
                                    <BigHoneycomb
                                        district={district}
                                        selectDistricts={selectDistricts}
                                        selectedDistricts={selectedDistricts}
                                    /> :
                                    <Honeycomb
                                        district={district}
                                        selectDistricts={selectDistricts}
                                        selectedDistricts={selectedDistricts}
                                    />
                            }
                        </div>
                    )
            }
        </div>
    );
};

export default HoneycombsMap;