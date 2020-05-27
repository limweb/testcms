import React from 'react'
import ReactExport from "react-export-excel"

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export function ExportTopVisitorCountry(props) {

    const { data = [], className = '', date = {} } = props
    const fileName = `top_visitor_country__${date.startDate}__${date.endDate}`

    return (
        <ExcelFile filename={fileName} element={<button className={className}><i className="fas fa-file-excel mr-2"></i>Export</button>}>
            <ExcelSheet data={data} name="top_visitor_country">
                <ExcelColumn label="Country" value='countryName' />
                <ExcelColumn label="Code" value='countryCode' />
                <ExcelColumn label="Total" value='total' />
            </ExcelSheet>
        </ExcelFile>
    );
}