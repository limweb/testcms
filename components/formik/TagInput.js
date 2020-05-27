import React, { useEffect, useState } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
    comma: 188,
    enter: 13,
}

const delimiters = [ KeyCodes.enter];

function TagInput(props) {

    const { field, form: { touched, errors, setFieldValue, values }, required } = props
    const isError = Boolean((errors[field.name] && touched[field.name]))

    const thisTags = values[field.name].map(tag => ({ id: tag, text: tag }))
    const setThisTags = (newTags) => {
        setFieldValue(field.name, newTags.map(newTag => newTag.id))
    }

    const handleDelete = (i) => {
        setThisTags(thisTags.filter((tag, index) => index !== i))
    }

    const handleAddition = (tag) => {
        if (!thisTags.find( thisTag => thisTag.id === tag.id)) {
            const newTags = [...thisTags, tag]
            setThisTags( newTags)
        }
    }

    const handleDrag = (tag, currPos, newPos) => {
        const tags = [...thisTags];
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag)
        setThisTags(newTags)
    }



    return (
        <div>
            {props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}
            <ReactTags
                classNames={{
                    tagInputField: 'form-control mb-2',
                    tag: 'btn btn-sm btn-danger mb-2 mr-1'
                }}
                allowDeleteFromEmptyInput={true}
                tags={thisTags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                autofocus={false}
                delimiters={delimiters} />
            {isError && <div className="text-danger">{errors[field.name]}</div>}
        </div>
    )
}

export { TagInput }
