import React from 'react'
import ReactExport from "react-export-excel"
import { formatDateTime } from '../util/date-time-utilities';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export function ExportVisitorList(props) {

    const { data = [], className = '', date = {} } = props
    const { visitorList } = data
    const fileName = `visitor_detail_list__${date.startDate}__${date.endDate}`
    
    return (
        <ExcelFile filename={fileName} element={<button className={className}><i className="fas fa-file-excel mr-2"></i>Export</button>}>
            <ExcelSheet data={visitorList} name="visitor detail list">
                <ExcelColumn label="Name" value={col => col.name} />
                <ExcelColumn label="Company" value={col => col.companyName} />
                <ExcelColumn label="Country" value={col => col.countryName} />
                <ExcelColumn label="Business Type" value={col => {
                    if (typeof col.businessType === 'string') {
                        return col.businessType
                    } else if (col.businessType.length > 0) {
                        return col.businessType.join(', ')
                    } else {
                        return ''
                    }
                }} />
                <ExcelColumn label="Last Online" value={col => formatDateTime(col.lastOnline)} />
            </ExcelSheet>
        </ExcelFile>
    );
}