import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'


function PreviewItem(props) {

    const { _id, src, name, onDelete, file } = props

    const deleteFileClick = () => {
        onDelete({ fileToDelete: file })
    }

    return (
        <li key={_id} className="d-flex justify-content-between align-items-baseline list-group-item">
            <span><i className="fas fa-file-pdf mr-1"></i>{name}</span>
            <span style={{ minWidth: '100px', maxWidth: '150px', textAlign: 'right' }}>
                <button className="_df_custom mr-1 btn btn-danger" backgroundcolor="#000000" webgl="true" source={src}><i className="fas fa-search-plus"></i></button>
                <button onClick={deleteFileClick} type="button" className="btn btn-danger"><i className="fas fa-trash-alt"></i></button>
            </span>
        </li>
    )
}


function FileDrop(props) {

    const { oldFiles = [], onChange = () => { }, onDelete = () => { } } = props
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: `application/pdf`
    })

    const previewList = []

    previewList.push(...oldFiles.map(file => {
        return (
            <PreviewItem key={file.id} _id={file.id} name={file.fileName} src={file.fileUrl} file={file} onDelete={onDelete} />
        )
    }))

    if (acceptedFiles.length > 0) {
        onChange({ acceptedFiles, oldFiles })
    }

    return (
        <div className="row">
            <div {...getRootProps({ className: 'col-lg-5 mb-2' })}>
                <div className="dropzone d-flex justify-content-center align-items-center flex-column" style={{height: '40vh'}}>
                    <input {...getInputProps()} />
                    <p><i className="fas fa-cloud-download-alt" style={{ fontSize: 36 }}></i></p>
                    <p>Drag & drop files here or click to select files</p>
                </div>
            </div>
            <div className="col-lg-7 table-responsive" >
                <h5>Files (.pdf)</h5>
                <ul className="list-group list-group-flush">{previewList}</ul>
            </div>
        </div>
    )
}

export { FileDrop }
