import React, { Component, Fragment } from 'react';

import Select from 'react-select/async';
import { components } from 'react-select';
import Ratio from 'react-ratio';


const CustomOption = (props) => {
    const { isDisabled, data: { label, image } } = props
    return !isDisabled ? (
        <components.Option {...props}>
            <div className="d-flex justify-content-start align-items-center">
                <Ratio ratio={1} className="container-img-crop mr-3" style={{ width: '50px' }}>
                    <div className="container-item-campaign" style={{ backgroundImage: `url("${image}")` }} />
                    <img
                        width="100%" height="100%" style={{ objectFit: 'contain', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}
                        src={image || '../../static/img/noimage.jpg'}
                        alt={label}
                        className="rounded"
                        title={label}
                    />
                </Ratio>
                {label}
            </div>
        </components.Option>
    ) : null;
}

export class SelectSuggest extends Component {

    state = {
        isClearable: true,
        isDisabled: false,
        isLoading: false,
        isRtl: false,
        isSearchable: true,
    };

    toggleClearable = () =>
        this.setState(state => ({ isClearable: !state.isClearable }));
    toggleDisabled = () =>
        this.setState(state => ({ isDisabled: !state.isDisabled }));
    toggleLoading = () =>
        this.setState(state => ({ isLoading: !state.isLoading }));
    toggleRtl = () => this.setState(state => ({ isRtl: !state.isRtl }));
    toggleSearchable = () =>
        this.setState(state => ({ isSearchable: !state.isSearchable }));

    promiseOptions = inputValue => {
        const { fetchCallback } = this.props
        return new Promise(resolve => {
            //change this part if use in many situation
            fetchCallback().then(res => {
                resolve(this.mapOptions(res.data.result.filter(item=>{
                    return item.name.toLowerCase().includes(inputValue.toLowerCase())
                })))
            })
        });
    }

    mapOptions = options => {
        return options.map(op => {
            return {
                value: op['exhibitorID'],
                label: op['name'],
                boothNumber: op['boothNumber'],
                image: op['imgageLogo']
            }
        })
    }

    render() {
        const {
            isClearable,
            isSearchable,
            isDisabled,
            isLoading,
            isRtl,
        } = this.state;

        const { field, form: { touched, errors, values, setFieldValue, setFieldTouched }, className = "form-control", required, onChange = ()=>{}, defaultOptions= [], disabled } = this.props
        const isError = Boolean((errors[field.name] && touched[field.name]))

        return (
            <Fragment>
                {this.props.label ? <label>{this.props.label} {required && <span className="text-danger">*</span>}</label> : ''}
                <Select
                    className={'basic-single'}
                    classNamePrefix="select"
                    styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
                    isDisabled={disabled}
                    isLoading={isLoading}
                    isClearable={isClearable}
                    isRtl={isRtl}
                    value={values[field.name]}
                    isSearchable={isSearchable}
                    name={field.name}
                    loadOptions={this.promiseOptions}
                    defaultOptions={defaultOptions}
                    components={{ Option: CustomOption}}
                    onBlur={() => setFieldTouched(field.name)}
                    onChange={selected => {
                        if (selected) {
                            setFieldValue(field.name, selected)
                        } else {
                            setFieldValue(field.name, null)
                        }
                        onChange(selected)
                    }}
                />
                {isError && <div className="text-danger">{errors[field.name]}</div>}
            </Fragment>
        );
    }
}