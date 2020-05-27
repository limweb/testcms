import React from 'react'
import { formatIntegerNumber } from '../../../util/utilities'

function TopVisitContact(props) {
    const { data: { contactList = [] } } = props
    return (
        <div className="table-responsive sm-scroll" style={{ height: '300px', overflowY: 'scroll' }}>
            <table className="table table-sm table-borderless">
                <thead>
                    <tr style={{ backgroundColor: 'rgb(245,246,250)' }}>
                        <th className="text-left" scope="col">#</th>
                        <th className="text-left" scope="col">Company</th>
                        <th className="text-right" scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {contactList.map((c, index) => {
                        const { exhibitorName, total, image } = c
                        return (
                            <tr className="align-middle" key={index}>
                                <td className="text-left align-middle">{index + 1}</td>
                                <td className="text-left align-middle">
                                    <img
                                        src={image || "../../../static/img/noimage.jpg"}
                                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                        className="mr-1 border"
                                        alt={exhibitorName}
                                        title={exhibitorName} />
                                    <span title={exhibitorName}>{exhibitorName}</span>
                                </td>
                                <td className="text-right align-middle">{formatIntegerNumber(total)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export { TopVisitContact }
