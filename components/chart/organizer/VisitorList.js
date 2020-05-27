import React from 'react'
import { formatDateTime } from '../../../util/date-time-utilities'

function VisitorList(props) {
    const { visitorList } = props.data
    return (
        <div className="table-responsive sm-scroll mb-2" style={{ overflowY: 'scroll', height: '320px' }}>
            <table className="table table-sm table-borderless">
                <thead>
                    <tr style={{ backgroundColor: 'rgb(245,246,250)' }} className="align-middle">
                        <th className="text-left" scope="col">#</th>
                        <th className="text-center" scope="col">Name</th>
                        <th className="text-center" scope="col">Company</th>
                        <th className="text-center" scope="col">Country</th>
                        <th className="text-center" scope="col">Business Type</th>
                        <th className="text-right" scope="col">Last Online</th>
                    </tr>
                </thead>
                <tbody>
                    {visitorList.map((v, index) => {
                        const { visitorID, name, companyName, countryName, businessType, lastOnline } = v
                        return (
                            <tr className="align-middle" key={visitorID}>
                                <td className="text-left">{index + 1}</td>
                                <td className="text-center">{name}</td>
                                <td className="text-center">{companyName}</td>
                                <td className="text-center">{countryName}</td>
                                <td className="text-center">{businessType}</td>
                                <td className="text-right">{formatDateTime(lastOnline)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export { VisitorList }
