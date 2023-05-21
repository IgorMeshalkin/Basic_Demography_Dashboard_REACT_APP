import React, {useEffect, useState} from 'react';
import './BigHoneycomb.css'

//Большая кнопка-сота. Применяется только для ХК(Хабаровский край)
const BigHoneycomb = ({district, selectDistricts, selectedDistricts}) => {

    const [isSelected, setIsSelected] = useState(false)

    useEffect(() => {
        if (selectedDistricts === district) {
            setIsSelected(true)
        } else {
            setIsSelected(false)
        }
    }, [selectedDistricts])

    function selectThis() {
        selectDistricts(district)
    }

    return (
        <div className="bhcMain">
            <div className="bhcBorder">
                <div className={isSelected ? 'bhcBody active' : 'bhcBody'} title={district.FullName} onClick={selectThis}/>
            </div>
            <div className="bhcMOMane">
                {district.ShortName}
            </div>
        </div>
    );
};

export default BigHoneycomb;