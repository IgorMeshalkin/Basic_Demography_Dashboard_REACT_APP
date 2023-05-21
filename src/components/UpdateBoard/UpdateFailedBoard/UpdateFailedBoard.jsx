import React from 'react';
import './UpdateFailedBoard.css'

const UpdateFailedBoard = ({invalidValuesList, setUpdateStatus}) => {

    function okFunction() {
        setUpdateStatus(0)
    }

    return (
        <div className="ufbMain">
            {
                invalidValuesList.length === 0 ?
                    <div className="ufbSmallMain">
                        <div className="ufbTitle">Внимание!</div>
                        <div className="ufbBoby">Не удалось сохранить данные по неизвестной причине. Повторите попытку
                            позже
                        </div>
                        <div className="ufbButton" onClick={okFunction}>Хорошо</div>
                    </div> :
                    <div className="ufbBigMain">
                        <div className="ufbTitle big">Внимание!</div>
                        <div className="ufbBoby big">В следующих строках введены некорректные данные. Допустимы только
                            целые или дробные числа. Пожалуйста
                            исправьте перед сохранением.
                        </div>
                        <div className="ufbTableContainer">
                            <table className="ufbTable">
                                <thead></thead>
                                <tbody className="ufbTableBody">
                                {
                                    invalidValuesList.map(item =>
                                        <tr key={item.name}>
                                            <td className="ufbLeftSell">
                                                {item.name}
                                            </td>
                                            <td className="ufbRightSell">
                                                "{item.value}"
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="ufbButton big" onClick={okFunction}>Хорошо</div>
                    </div>
            }
        </div>
    );
};

export default UpdateFailedBoard;