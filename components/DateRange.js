import React from 'react'
import { DateRange } from 'react-date-range';
import Popover from 'react-simple-popover';
import { addDays } from 'date-fns';
import moment from 'moment'

class PickerRange extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dateRangePicker: {
                selection: {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection',
                },
                compare: {
                    startDate: new Date(),
                    endDate: addDays(new Date(), 3),
                    key: 'compare',
                },
            },
            dateSelect: {
                label: 'Last 90 days',
                startDate: '90daysAgo',
                endDate: 'today'
            }
        };
    }

    handleClick = (e) => {
        this.setState({ open: !this.state.open });
    }

    handleClose = (e) => {
        this.setState({ open: false });
    }

    handleRangeChange(date) {

        console.log("date", date)

        // this.setState({open:false})

        this.setState({
            dateRangePicker: {
                selection: date.selection
            },
        })
    }

    saveState(state) {

        this.setState({
            open: false, dateSelect: state
        })
        this.props.onSelectDate(state)

    }

    render() {

        return (
            <div >

                {/* <span
                    href="#"
                    ref={(node) => { this.target = node }}
                    onClick={this.handleClick}>Popover <i className="fa fa-angle-down" /></span> */}

                <div className="dropdown custom-dropdown mt-2 form-control px-0" ref={(node) => { this.target = node }}>
                    <div className="text-left pl-2" style={{ cursor: 'pointer' }} data-toggle="dropdown" >
                        {this.state.dateSelect.label}
                        <i className="fa fa-angle-down ml-1" style={{ position: 'absolute', right: '6px', top: '12px' }} />
                    </div>
                    <div className="dropdown-menu dropdown-menu-center" style={{ right: '8px' }}>
                        <span className="dropdown-item m-item-dropdown" onClick={() => {

                            this.saveState({
                                label: `Today`,
                                startDate: 'today',
                                endDate: 'today',
                                date: {
                                    startDate: new Date(),
                                    endDate: new Date()
                                }
                            })


                        }}>Today</span>
                        <span className="dropdown-item m-item-dropdown" href="#" onClick={() => {
                            this.saveState({
                                label: `Yesterday`,
                                startDate: 'yesterday',
                                endDate: 'yesterday',
                                date: {
                                    startDate: addDays(new Date(), -1),
                                    endDate: addDays(new Date(), -1),
                                }
                            })

                        }}>Yesterday</span>
                        <span className="dropdown-item m-item-dropdown" href="#" onClick={() => {
                            this.saveState({
                                label: `Last 7 days`,
                                startDate: '7daysAgo',
                                endDate: 'today',
                                date: {
                                    startDate: addDays(new Date(), -7),
                                    endDate: new Date(),
                                }
                            })

                        }}>Last 7 days</span>
                        <span className="dropdown-item m-item-dropdown" href="#" onClick={() => {
                            this.saveState({
                                label: `Last 28 days`,
                                startDate: '28daysAgo',
                                endDate: 'today',
                                date: {
                                    startDate: addDays(new Date(), -28),
                                    endDate: new Date(),
                                }
                            })

                        }}>Last 28 days</span>
                        <span className="dropdown-item m-item-dropdown" href="#" onClick={() => {
                            this.saveState({
                                label: `Last 90 days`,
                                startDate: '90daysAgo',
                                endDate: 'today',
                                date: {
                                    startDate: addDays(new Date(), -90),
                                    endDate: new Date(),
                                }
                            })

                        }}>Last 90 days</span>
                        <span className="dropdown-item m-item-dropdown" href="#" onClick={this.handleClick}>Custom</span>
                    </div>
                </div>

                <Popover
                    placement='left'
                    container={this.props.container}
                    target={this.target}
                    show={this.state.open}
                    style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: '0px' }}
                    onHide={this.handleClose} >
                    <div className={'PreviewArea'} style={{ width: '332px' }}>

                        <DateRange
                            className="date-dashboard"
                            onChange={this.handleRangeChange.bind(this)}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            ranges={[this.state.dateRangePicker.selection]}
                            direction="vertical"
                        />
                        <hr />
                        <div className="row mr-2 pb-2">
                            <div className="col" />
                            <button type="button" className="btn btn-light mr-1" onClick={() => {
                                this.setState({ open: false })
                            }}>Cancel</button>
                            <button type="button" style={{ color: 'rgb(169, 36, 27)' }} className="btn btn-light" onClick={() => {

                                this.saveState({
                                    label:'Custom',
                                    // label: `${moment(this.state.dateRangePicker.selection.startDate).format('MMM D, YYYY')} - ${moment(this.state.dateRangePicker.selection.endDate).format('MMM D, YYYY')}`,
                                    startDate: moment(this.state.dateRangePicker.selection.startDate).format('YYYY-MM-DD'),
                                    endDate: moment(this.state.dateRangePicker.selection.endDate).format('YYYY-MM-DD'),
                                    date: {
                                        startDate: this.state.dateRangePicker.selection.startDate,
                                        endDate: this.state.dateRangePicker.selection.endDate,
                                    }
                                })

                            }}>Apply</button>
                        </div>
                    </div>
                </Popover>



            </div>)
    }
}

export { PickerRange }