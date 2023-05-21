import React, {useEffect, useState} from 'react';
import './Honeycomb.css'

//Кнопка-сота обычная.
const Honeycomb = ({district, selectDistricts, selectedDistricts}) => {

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
        <div className="hcMain">
            <div className="hcBorder">
                <div className={isSelected ? 'hcBody active' : 'hcBody'} title={district.FullName} onClick={selectThis}/>
            </div>
            <div className="hcMOMane">
                {district.ShortName}
            </div>
        </div>
    );
};

export default Honeycomb;