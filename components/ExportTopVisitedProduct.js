import React from 'react'
import ReactExport from "react-export-excel"

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export function ExportTopVisitedProduct(props) {

    const { data = {}, className = '', date = {} } = props
    const fileName = `top_visited_product__${date.startDate}__${date.endDate}`

    return (
        <ExcelFile filename={fileName} element={<button className={className}><i className="fas fa-file-excel mr-2"></i>Export</button>}>
            <ExcelSheet data={data} name="top_visited_product">
                <ExcelColumn label="Product Name" value='productName' />
                <ExcelColumn label="Exhibitor" value='exhibitorName' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label="Image" value='image' />
            </ExcelSheet>
        </ExcelFile>
    );
}