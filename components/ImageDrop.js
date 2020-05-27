import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { dialog } from './sweet-dialog';

const thumb = {
    display: 'inline-flex',
    position: 'relative',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
    height: 150,
    boxSizing: 'border-box',
    cursor: 'grab'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const deletes = {
    height: '30px',
    padding: '8px',
    width: '30px',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '15px',
    alignItems: 'center',
    cursor: 'pointer',
    top: '6px',
    right: '6px'
}

const view = {
    height: '30px',
    width: '30px',
    padding: '8px',
    borderRadius: '15px',
    position: 'absolute',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    bottom: '6px',
    right: '6px'
}

function PreviewItem(props) {

    const { file, onDelete, uploadedFiles, onMetaChange } = props
    const { id, fileUrl, fileName } = file

    const deleteFileClick = () => () => {
        onDelete({ fileToDelete: file, uploadedFiles })
    }

    const viewImage = () => () => {
        if (onMetaChange) {
            onMetaChange({ file, uploadedFiles })
        } else {

            dialog.showModal({
                html: (
                    <div className="" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <div className="d-flex justify-content-center">
                            <div className="col-lg-8 mb-2 text-center">
                                <div className="text-center">
                                    <img src={fileUrl} className="preview-img-modal" />
                                </div>
                            </div>
                        </div>

                    </div>
                )
            })
        }
    }

    return (
        <div style={thumb} key={id}>
            <div style={thumbInner}>
                <img
                    src={fileUrl}
                    style={img}
                    alt={fileName}
                />
                <div onClick={deleteFileClick()} style={deletes}><i className="fas fa-times"></i></div>
                <div onClick={viewImage()} style={view}><i className="fas fa-search-plus"></i></div>
            </div>
        </div>
    )
}

const SortableItem = sortableElement(({ value }) => <PreviewItem key={value._id} {...value} />)

const SortableContainer = sortableContainer(({ children }) => {
    return <div>{children}</div>;
})

function ImageDrop(props) {

    const { oldFiles = [], onAddFile = () => { }, onSorted = () => { }, onMetaChange, onDelete = () => { }, previewGallery = false, PreviewComponent = () => <span></span>, onClear } = props
    const [uploadedFiles, setUploadedFiles] = useState(oldFiles)
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: `image/gif, image/jpeg, image/png, image/jpg`
    })

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const sortedImgs = arrayMove(uploadedFiles, oldIndex, newIndex)
        setUploadedFiles([...sortedImgs])
        onSorted(sortedImgs)
    }

    const clearAllImages = (uploadedFiles) => () => {
        if (onClear) {
            onClear(uploadedFiles)
        }
    }

    const previewList = []

    previewList.push(...uploadedFiles.map((file, index) => {
        return (
            <SortableItem disabled={false} key={file.id} index={index} value={{ file, onMetaChange, onDelete, uploadedFiles }} />
        )
    }))

    if (acceptedFiles.length > 0) {
        onAddFile({ acceptedFiles, uploadedFiles })
    }

    useEffect(() => {
        setUploadedFiles(oldFiles)
    }, [oldFiles])

    return (
        <div className="row">
            <div className={`${previewGallery ? 'col-md-7' : 'col-md-12'}`}>
                <div {...getRootProps({ className: `dropzone  d-flex justify-content-center align-items-center flex-column` })} style={{ height: '100%' }}>
                    <input {...getInputProps()} />
                    <p><i className="fas fa-cloud-download-alt" style={{ fontSize: 36 }}></i></p>
                    <p>Drag & drop images here or click to select images</p>
                </div>
            </div>
            {previewGallery ? (
                <div className={`col-md-5`}>
                    <PreviewComponent images={[...uploadedFiles]} />
                </div>
            ) : ''}
            <div className={"col-md-12 mt-2"}>
                <div className="jumbotron jumbotron-fluid p-2 rounded" style={{overflowY:'scroll', maxHeight:'500px'}}>
                    <h5>
                        {onClear && uploadedFiles.length > 0 ? (
                            <button onClick={clearAllImages(uploadedFiles)} className="btn btn-sm btn-danger float-right">Clear</button>
                        ) : ''}
                    </h5>
                    {uploadedFiles.length > 0 ? (
                        <SortableContainer onSortEnd={onSortEnd} axis="xy" distance={2}>
                            {previewList}
                        </SortableContainer>
                    ) : (
                            <div className="d-flex justify-content-center align-items-center flex-column p-2">
                                <p><i className="fas fa-images" style={{ fontSize: 42 }}></i></p>
                                <h4>No Image</h4>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export { ImageDrop }