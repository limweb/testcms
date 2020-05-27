import React, { Component } from 'react'

class Pagination extends Component {

    handleNextJumpClick(){

        const { currentPage, onClick = () => {}, length } = this.props

        onClick(currentPage + length + 1)

    }
    

    handlePreviousJumpClick(){

        const { currentPage, onClick = () => {}, length } = this.props

        onClick(currentPage - length - 1)

    }


    handleClick = (number) => () => {

        const { onClick = () => {}} = this.props

        onClick(number)

    }


    render() {

        const { total, pageSize, currentPage, length = 1, className = 'd-inline-block', containerClassName = 'd-flex justify-content-center' } = this.props

        const totalPage = Math.ceil(total / pageSize)

        const isPreviousDisable = currentPage <= 1 ? 'disabled' : ''

        const isNextDisable = currentPage >= totalPage ? 'disabled' : ''

        const isPreviousJumpDisable  = currentPage - length <= 1 ? 'disabled' : ''

        const isNextJumpDisable = currentPage + length >= totalPage ? 'disabled' : ''

        const renderLeftNumber = () => {
            const list = []

            if (!isPreviousJumpDisable) {
                list.push(<li key={1} className="page-item"><button className="page-link" onClick={this.handleClick(1)} >{1}</button></li>)
                list.push(<li key={'prev...'} className="page-item"><button className="page-link" onClick={this.handlePreviousJumpClick.bind(this)} >...</button></li>)
            }


            for (let i = currentPage - length; i < currentPage; i++) {
                if (i > 0) {
                    list.push(<li key={i} className="page-item"><button className="page-link" onClick={this.handleClick(i)} >{i}</button></li>)
                }
            }

            return list
        }

        const renderRightNumber = () => {
            const list = []

            for (let i = currentPage + 1; i <= currentPage + length; i++) {
                if (i <= totalPage) {
                    list.push(<li key={i} className="page-item"><button className="page-link" onClick={this.handleClick(i)} >{i}</button></li>)
                }
            }

            if (!isNextJumpDisable) {
                list.push(<li key={'next...'} className="page-item"><button className="page-link" onClick={this.handleNextJumpClick.bind(this)} >...</button></li>)
                list.push(<li key={totalPage} className="page-item"><button className="page-link" onClick={this.handleClick(totalPage)} >{totalPage}</button></li>)
            }

            return list
        }

        if (total === 0) {
            return ''
        }

        return (
            <div className={containerClassName}>
                <nav aria-label="..." className={className}>
                    <ul className="pagination">

                        <li className={`page-item text-red ${ isPreviousDisable }`}>
                            <button className=" page-link"  onClick={this.handleClick(currentPage - 1)}>Previous</button>
                        </li>

                        {renderLeftNumber()}

                        <li className="page-item active">
                            <button className="btn btn-danger no-border-radius">{currentPage} <span className="sr-only">(current)</span></button>
                        </li>

                        {renderRightNumber()}

                        <li className={`page-item text-red ${ isNextDisable }`}>
                            <button className="page-link" onClick={this.handleClick( currentPage + 1)}>Next</button>
                        </li>

                    </ul>
                </nav>
            </div>
        )
    }
}


export { Pagination }