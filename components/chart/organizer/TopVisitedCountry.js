import React from 'react'
import { formatIntegerNumber } from '../../../util/utilities'

function TopVisitedCountry(props) {
    const { data: { visitorCountryList = [] } } = props
    return (
        <div className="table-responsive sm-scroll" style={{ height: '160px', overflowY: 'scroll' }} >
            <table className="table table-sm table-borderless">
                <thead>
                    <tr style={{ backgroundColor: 'rgb(245,246,250)' }}>
                        <th className="text-left" scope="col">#</th>
                        <th className="text-left" scope="col">Country</th>
                        <th className="text-right" scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {visitorCountryList.map((c, index) => {
                        const { countryName, total } = c
                        return (
                            <tr className="align-middle" key={index}>
                                <td className="text-left">{index + 1}</td>
                                <td className="text-left">{countryName}</td>
                                <td className="text-right">{formatIntegerNumber(total)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export { TopVisitedCountry }
