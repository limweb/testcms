import React from 'react'

const TextArea = (props) => {

    const { field, form: { touched, errors, }, required, placeholder,containerClassName, ...other } = props
    const isError = Boolean((errors[field.name] && touched[field.name]))
    
    return (
         <div className={`${containerClassName}`}>
            { props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}
            <textarea
                {...field}
                {...other}
                
                placeholder={placeholder}
                onWheel={event => { event.preventDefault(); }}
                onChange={
                    event => {

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


                        field.onChange(e)
                    }
                } />

                 {isError && <div className="text-danger">{errors[field.name]}</div>}
                 
        </div>
    )
}

export { TextArea }