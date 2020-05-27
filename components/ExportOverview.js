import React from 'react'
import ReactExport from "react-export-excel"
import { formatDate, formatDateTime } from '../util/date-time-utilities';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export function ExportOverview(props) {

    const { pageState = {}, className = '' } = props
    const { originExhibitor, originVisitor,
        topVisitorByCountry, total, totalVisitorByBooth,
        uniqueBusinessFunction, visitorByHall, topVisitedBooth,
        topVisitedContact, topVisitedProduct, uniqueProductSourcing,
        visitorList,

        originExhibitorDate, originVisitorDate, topVisitedBoothDate,
        topVisitedContactDate, topVisitedProductDate, topVisitorByCountryDate,
        totalVisitorByBoothDate, uniqueBusinessFunctionDate, uniqueProductSourcingDate,
        visitorByHallDate, visitorListDate
    } = pageState
    const fileName = 'overview_reports'



    return (
        <ExcelFile filename={fileName} element={<button className={className}><i className="fas fa-file-excel mr-2"></i>Export</button>}>

            <ExcelSheet data={[total]} name="total">
                <ExcelColumn label="Total Visitors" value='totalVistor' />
                <ExcelColumn label="Total Exhibitors" value='totalExhibitor' />
                <ExcelColumn label="Total" value='total' />
            </ExcelSheet>

            <ExcelSheet data={[originVisitor]} name={`origin_visitors`}>
                <ExcelColumn label="Oversea" value='oversea' />
                <ExcelColumn label="Local" value='local' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label={`${originVisitorDate.startDate}__${originVisitorDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={[originExhibitor]} name={`origin_exhibitors`}>
                <ExcelColumn label="Oversea" value='oversea' />
                <ExcelColumn label="Local" value='local' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label={`${originExhibitorDate.startDate}__${originExhibitorDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={topVisitorByCountry.visitorCountryList} name={`top_visit_country`}>
                <ExcelColumn label="Country" value='countryName' />
                <ExcelColumn label="Code" value='countryCode' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label={`${topVisitorByCountryDate.startDate}__${topVisitorByCountryDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={totalVisitorByBooth} name={`total_visitor_booth`}>
                <ExcelColumn label="Date" value={col => formatDate(col.date)} />
                <ExcelColumn label="Unique" value='unique' />
                <ExcelColumn label="Not Unique" value='notUnique' />
                <ExcelColumn label={`${totalVisitorByBoothDate.startDate}__${totalVisitorByBoothDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={visitorByHall} name={`visitor_by_hall`}>
                <ExcelColumn label="Hall Name" value='hallName' />
                <ExcelColumn label="Unique" value='unique' />
                <ExcelColumn label="Not Unique" value='notUnique' />
                <ExcelColumn label={`${visitorByHallDate.startDate}__${visitorByHallDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={uniqueBusinessFunction} name={`uniq_bus_func`}>
                <ExcelColumn label="Business" value='business' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label={`${uniqueBusinessFunctionDate.startDate}__${uniqueBusinessFunctionDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={uniqueProductSourcing} name={`uniq_prod_source`}>
                <ExcelColumn label="Product Category" value='productCategoryName' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label={`${uniqueProductSourcingDate.startDate}__${uniqueProductSourcingDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={topVisitedBooth.boothList} name={`top_visited_booth`}>
                <ExcelColumn label="Exhibitor Name" value='exhibitorName' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label="Logo" value='image' />
                <ExcelColumn label={`${topVisitedBoothDate.startDate}__${topVisitedBoothDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={topVisitedContact.contactList} name={`top_visited_contact`}>
                <ExcelColumn label="Exhibitor Name" value='exhibitorName' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label="Logo" value='image' />
                <ExcelColumn label={`${topVisitedContactDate.startDate}__${topVisitedContactDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={topVisitedProduct.productList} name={`top_visited_product`}>
                <ExcelColumn label="Product Name" value='productName' />
                <ExcelColumn label="Exhibitor" value='exhibitorName' />
                <ExcelColumn label="Total" value='total' />
                <ExcelColumn label="Image" value='image' />
                <ExcelColumn label={`${topVisitedProductDate.startDate}__${topVisitedProductDate.endDate}`} value={() => ''} />
            </ExcelSheet>

            <ExcelSheet data={visitorList.visitorList} name={`visitor_list`}>
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
                <ExcelColumn label={`${visitorListDate.startDate}__${visitorListDate.endDate}`} value={() => ''} />
            </ExcelSheet>

        </ExcelFile>
    );
}