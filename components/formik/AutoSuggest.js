import React, { Component } from 'react'
import Autosuggestion from 'react-autosuggest'

const exhibitors = [
    {
        name: 'Soundpeats Audio',
        id: 'aab12f6'
    },
    {
        name: 'Godot Engine',
        id: 'cf65dfa'
    },
    {
        name: 'Eventpass',
        id: 'e34fa7b'
    },
    {
        name: 'Eventthai',
        id: 'e34fa7d'
    },

];

const getSuggestionValue = suggestion => suggestion.name;


const renderSuggestion = suggestion => (
    <div key={suggestion.id}>
        {suggestion.name}
    </div>
)

// สำหรับ fetch api แต่ตอนนี้คือ filter จาก const exhibitors
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : exhibitors.filter(ex =>
        ex.name.toLowerCase().slice(0, inputLength) === inputValue
    );
}

export class AutoSuggest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            suggestions: []
        }
    }

    onChange = (event, { newValue }) => {
        const { onChange = ()=>{}, field : { name }, form: { setFieldValue } } = this.props
        console.log(newValue);
        // onChange(newValue)
        setFieldValue(name, newValue)
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };


    render() {
        const { field, form: { touched, errors, values }, containerClassName, className = "form-control", required, placeholder = "" } = this.props
        const isError = Boolean((errors[field.name] && touched[field.name]))
        const { suggestions } = this.state;

        const inputProps = {
            placeholder,
            value: values[field.name],
            onChange: this.onChange,
            className
        }

        return (
            <div className={containerClassName}>
                {this.props.label ? <label>{this.props.label} {required && <span className="text-danger">*</span>}</label> : ''}
                <Autosuggestion
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    alwaysRenderSuggestions={true}
                />
                {isError && <div className="text-danger">{errors[field.name]}</div>}
            </div>
        )
    }

}