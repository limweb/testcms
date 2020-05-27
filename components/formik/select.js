import React from 'react'

const Select = (props) => {

    const { field, form: { touched, errors, setFieldValue }, options,containerClassName, onChange = () => { }, idFieldName = '_id', labelFieldName = 'name', langFieldName = 'en', isMultiLang = true, classes, required, placeholder, isNotEmpty = false, ...other  } = props

    const isError = Boolean((errors[field.name] && touched[field.name]))

    const handleSelect = (e) =>{
        setFieldValue(field.name, e.target.value)
        onChange(e)
    }

    const renderLabel = (op) => {

        if (isMultiLang) {
            return op[labelFieldName][langFieldName]
        } else {
            return op[labelFieldName]
        }
    }

    var className = "form-control "
    var textClass = ""
    // if (isError) {
    //     // className = "form-control-error"
    //     textClass = "err-text"
    // }
 

    return (
        <div className={`${containerClassName}`}>
            { props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}
            <select
                className={`${className} ${props.className} ${textClass}`}
                {...field}
                {...other}
                onChange={handleSelect}
            >
                {isNotEmpty ? null : <option value={''}>Select...</option>}
                {options && options.map(value=>{
                    return <option key={value[idFieldName]} value={value[idFieldName]}>{renderLabel(value)}</option>
                    // return <option key={value.value} value={value.value}>{value.label}</option>
                })}
            </select>
            {isError && <div className="text-danger">{errors[field.name]}</div>}
        </div>
    )

}

export { Select }