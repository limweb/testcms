import React from 'react'

function VisitorList(props) {
    return (
        <div className="table-responsive">
            <table className="table table-sm table-borderless">
                <thead>
                    <tr style={{ backgroundColor: 'rgb(245,246,250)' }} className="align-middle">
                        <th className="text-left" scope="col">Name</th>
                        <th className="text-center" scope="col">Company</th>
                        <th className="text-center" scope="col">Country</th>
                        <th className="text-center" scope="col">Business Type</th>
                        <th className="text-right" scope="col">Last Online</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="align-middle">
                        <td className="text-left">Peeratat Mantaga</td>
                        <td className="text-center">Eventthai</td>
                        <td className="text-center">Thailand</td>
                        <td className="text-center">Import</td>
                        <td className="text-right">07/05/2020 18:20:00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export { VisitorList }
