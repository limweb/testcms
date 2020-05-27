import React, { useState, useMemo } from 'react'
import MultiSelector from "@khanacademy/react-multi-select"
import Ratio from 'react-ratio';

const formatOptions = (opt = [], label = "name", value = "id", image) => {
    if (image) {
        return opt.map(option => ({ label: option[label], value: option[value], image: option[image] }))
    } else {
        return opt.map(option => ({ label: option[label], value: option[value] }))
    }
}

function CheckBox(props) {
    const { onCheck, checked, option } = props
    const { label, image } = option
    if (image) {
        return (
            <div className="form-check d-flex align-items-center">
                <input type="checkbox" className="form-check-input mt-0" checked={checked} onChange={onCheck} />
                <Ratio ratio={1} className="container-img-crop mx-2" style={{ width: '36px' }}>
                    <div className="container-item-campaign rounded" style={{ backgroundImage: `url("${image}")` }} />
                    <img
                        width="100%" height="100%" style={{ objectFit: 'contain', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}
                        src={image || '../../static/img/noimage.jpg'}
                        alt={label}
                        className="rounded"
                        title={label}
                    />
                </Ratio>
                <label className="form-check-label">{label}</label>
            </div>
        )
    } else {
        return (
            <div className="form-check">
                <input type="checkbox" className="form-check-input" checked={checked} onChange={onCheck} />
                <label className="form-check-label">{label}</label>
            </div>
        )
    }
}

function MultiSelect(props) {

    const { options = [], labelField, valueField, imageField, placeholder, field, form: { touched, errors, setFieldValue, values }, containerClassName, onChange = () => { }, required, className } = props
    const isError = Boolean((errors[field.name] && touched[field.name]))
    // const [selected, setSelected] = useState([])

    const optionsForUse = useMemo(() => {
        return formatOptions(options, labelField, valueField, imageField)
    }, [options])

    const renderOption = ({ checked, option, onClick }) => (
        <CheckBox
            option={option}
            label={option.label}
            onCheck={onClick}
            checked={checked}
        />
    )

    return (
        <div className={`${containerClassName}`}>
            {props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}
            <MultiSelector
                options={optionsForUse}
                // selected={selected}
                ItemRenderer={renderOption}
                selected={values[field.name]}
                onSelectedChanged={selected => {
                    // setSelected(selected)
                    setFieldValue(field.name, selected)
                    onChange(selected)
                }}
            />
            {isError && <div className="text-danger">{errors[field.name]}</div>}
        </div>
    )
}

export { MultiSelect }
