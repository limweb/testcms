import React, { useState, useEffect } from 'react'
import DatePickerLib from 'react-modern-calendar-datepicker';
import moment from 'moment';


const myCustomLocale = {
    // months list by order
    months: [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
    ],

    // week days by order
    weekDays: [
        {
            name: 'อาทิตย์', // used for accessibility 
            short: 'อาทิตย์', // displayed at the top of days' rows
            isWeekend: true, // is it a formal weekend or not?
        },
        {
            name: 'จันทร์',
            short: 'จันทร์',
        },
        {
            name: 'อังคาร',
            short: 'อังคาร',
        },
        {
            name: 'พุธ',
            short: 'พุธ',
        },
        {
            name: 'พฤหัสบดี',
            short: 'พฤหัสบดี',
        },
        {
            name: 'ศุกร์',
            short: 'ศุกร์',
        },
        {
            name: 'เสาร์',
            short: 'เสาร์',
            isWeekend: true,
        },
    ],

    // just play around with this number between 0 and 6
    weekStartingIndex: 0,

    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject) {
        gregorainTodayObject.year = gregorainTodayObject.year + 543
        return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date) {
        return new Date(date.year - 543, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date) {
        return new Date(date.year - 543, date.month, 0).getDate();
    },

    // return a transformed digit to your locale
    transformDigit(digit) {
        return digit;
    },

    // texts in the date picker
    nextMonth: 'Next Month',
    previousMonth: 'Previous Month',
    openMonthSelector: 'Open Month Selector',
    openYearSelector: 'Open Year Selector',
    closeMonthSelector: 'Close Month Selector',
    closeYearSelector: 'Close Year Selector',
    defaultPlaceholder: 'Select...',

    // for input range value
    from: 'from',
    to: 'to',


    // used for input value when multi dates are selected
    digitSeparator: ',',

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: false,
}



function DatePicker(props) {

    const { mode = "day", field, form: { touched, errors, }, classes, required, placeholder, type, isNotClearable = false, containerClassName, onKeyDown = () => { }, ...other } = props
    const isError = Boolean((errors[field.name] && touched[field.name]))
    const [selectedDay, setSelectedDay] = useState(mode === 'range' ? { from: null, to: null } : null);
    const [oldDate, handleOldDateChange] = useState();

    let inputValue = selectedDay ? moment(`${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`, 'DD-MM-YYYY').format("DD/MM/YYYY") : ''
    if (mode === 'range') {
        inputValue = selectedDay.from && selectedDay.to ? moment(`${selectedDay.from.day}/${selectedDay.from.month}/${selectedDay.from.year}`, 'DD-MM-YYYY').format("DD/MM/YYYY") + ' - ' + moment(`${selectedDay.to.day}/${selectedDay.to.month}/${selectedDay.to.year}`, 'DD-MM-YYYY').format("DD/MM/YYYY") : ''
    }

    useEffect(() => {
        document.getElementById(field.name).readOnly = true;

        if (mode === 'range') {
            if (field.value && field.value.from && field.value.to) {
                if (!selectedDay.from && !selectedDay.to ) {
                    const from = moment(field.value.from, "DD-MM-YYYY")
                    const to = moment(field.value.to, "DD-MM-YYYY")
                    const dateValue = {
                        from: { day: from.date(), month: from.month() + 1, year: from.year() },
                        to: { day: to.date(), month: to.month() + 1, year: to.year() }
                    }
                    
                    handleOldDateChange(dateValue)
                    setSelectedDay(dateValue)
                }

            } else {
                document.getElementById(field.name).value = ""
            }
        } else {
            if (field.value != "" && field.value) {
                if (!selectedDay && oldDate != field.value) {
                    const initDate = moment(field.value, "DD-MM-YYYY")
                    const dateValue = { day: initDate.day(), month: initDate.month() + 1, year: initDate.year() }
                    handleOldDateChange(dateValue)
                    setSelectedDay(dateValue)
                }

            } else {
                document.getElementById(field.name).value = ""
            }
        }

    })

    const Input = ({ ref }) => {

        return (
            <input ref={ref}
                className="form-control"
                {...field}
                {...other}
                // onChange={(e) =>{
                //     field.onChange(e)
                // }}
                onFocus={e => {
                    if (isNotClearable) {
                        e.target.select()
                    }
                }}
                id={field.name}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                onWheel={event => { event.preventDefault(); }}
                style={{ backgroundColor: props.disabled ? '#E0E0E0' : 'white' }}
                value={inputValue} placeholder="Select Date" />
        )
    }

    return (

        <div className={containerClassName} >

            {props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}
            <div>
                <DatePickerLib
                    value={selectedDay}
                    onChange={(date) => {


                        setSelectedDay(date)

                        if (mode === 'range') {
                            if (date.from && date.to) {
                                const event = {
                                    target: {
                                        name: field.name,
                                        value: {
                                            from: moment(`${date.from.day}/${date.from.month}/${date.from.year}`, 'DD/MM/YYYY').format("DD-MM-YYYY"),
                                            to: moment(`${date.to.day}/${date.to.month}/${date.to.year}`, 'DD/MM/YYYY').format("DD-MM-YYYY")
                                        }
                                    }
                                }

                                field.onChange(event)
                            } else {

                                const event = {
                                    target: {
                                        name: field.name,
                                        value: {
                                            from: null,
                                            to: null
                                        }
                                    }
                                }
                                field.onChange(event)
                            }
                        } else {
                            if (date) {
                                const event = {
                                    target: {
                                        name: field.name,
                                        value: moment(`${date.day}/${date.month}/${date.year}`, 'DD/MM/YYYY').format("DD-MM-YYYY")
                                    }
                                }

                                field.onChange(event)
                            } else {

                                const event = {
                                    target: {
                                        name: field.name,
                                        value: ``
                                    }
                                }
                                field.onChange(event)
                            }
                        }

                    }}
                    inputPlaceholder="Select a day"
                    shouldHighlightWeekends
                    renderInput={Input}
                    colorPrimary="#28becd"
                // locale={myCustomLocale}
                />
            </div>


            {isError && <div className="text-danger">{errors[field.name]}</div>}

        </div>



    )
}

export { DatePicker }