import React from 'react'

const TextField = (props) => {

    const { field, form: { touched, errors, }, className, required, placeholder, type, isNotClearable = false, containerClassName, onKeyDown = () => { }, autoComplete = 'on',  ...other } = props
    const isError = Boolean((errors[field.name] && touched[field.name]))

    return (
        <div className={containerClassName}>
            {props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}
            <input
            
                type={type}
                className={`form-control ${className}`}
                {...field}
                {...other}
                autoComplete={autoComplete}
                placeholder={placeholder}
                onWheel={event => { event.preventDefault(); }}
                style={{ backgroundColor: props.disabled ? '#E0E0E0' : 'white' }}
                onChange={
                    event => {

                        if (!(isNotClearable && event.target.value === '')) {

                            var e = event
                            if (props.maxLength) {
                                e.target.value = e.target.value.slice(0, props.maxLength);
                            }

                            if (props.positive && e.target.value.length > 0) {
                                e.target.value = e.target.value.replace('-', "")
                            }
                            if (props.max && e.target.value > props.max) {
                                e.target.value = props.max
                            }
                            if (props.min && e.target.value < props.min) {
                                e.target.value = props.min
                            }

                            e.target.value = (e.target.value + '').trimLeft()

                            field.onChange(e)
                        }
                    }

                }
                onFocus={e => {
                    if (isNotClearable) {
                        e.target.select()
                    }
                }}
                onKeyDown={onKeyDown}
            />

            {isError && <div className="text-danger">{errors[field.name]}</div>}

        </div>
    )
}

export { TextField }