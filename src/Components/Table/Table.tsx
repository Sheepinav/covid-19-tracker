import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({ countries }: { countries :any }) {
    return (
        <div className="table">
            <table>
                <tbody>
                    {countries.map((country: any) => (
                        <tr key={country.country}>
                            <td>
                                {country.country}
                            </td>
                            <td>
                                <b>{numeral(country.cases).format("0,0")}</b>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table
