import React from 'react'

const GroupCheck = (props) => {

    const { field, form: { touched, errors, }, classes, required, placeholder, type, isNotClearable = false, containerClassName, onKeyDown = () => { },onChange, ...other } = props
    const isError = Boolean((errors[field.name] && touched[field.name]))

    var className = "form-control "
    if (isError) {
        // className = "form-control-error"
    }



    return (
        <div className={containerClassName}>
            <label className="radio-inline">
                <input
                    type={type}
                    className={`${props.className} mr-2`}
                    {...field}
                    {...other}
                    placeholder={placeholder}
                    onWheel={event => { event.preventDefault(); }}
                    style={{ backgroundColor: props.disabled ? '#E0E0E0' : 'white' }}
                    onChange={
                        event => {

                            field.onChange(event)

                            if (onChange) {
                                onChange(event)
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
                {props.label || ''}
            </label>
           

            {isError && <div className="label-error">{errors[field.name]}</div>}

        </div>
    )
}

export { GroupCheck }