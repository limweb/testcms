import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BASE_URL } from '../../util/constants'

const FroalaEditorComponent = dynamic(
    () => {
        return new Promise(resolve =>
            import("froala-editor/js/plugins.pkgd.min.js").then(e => {
                import("react-froala-wysiwyg").then(resolve);
            })
        );
    },
    {
        loading: () => null,
        ssr: false
    }
)

function FroalaEditor(props) {

    const { field, form: { touched, errors, setFieldValue, values }, required, className = "", onDeleteImage = () => { }, heightMax = 800, media = true, zIndex } = props
    const value = values[field.name]
    const isError = Boolean((errors[field.name] && touched[field.name]))

    const rich = ['insertLink', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
    if (media) rich.push('insertImage', 'insertVideo')

    const config = {
        apiKey:'4NC5fD4F4D4I3D3A4B-16UJHAEFZMUJOYGYQEa2d2ZJd1RAeF3C8B5E5E3D3E2G3A14A7==',
        heightMax,
        zIndex,
        toolbarButtons: {
            // Key represents the more button from the toolbar.
            moreText: {
                // List of buttons used in the  group.
                buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],

                // Alignment of the group in the toolbar.
                align: 'left',

                // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
                buttonsVisible: 3
            },


            moreParagraph: {
                buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
                align: 'left',
                buttonsVisible: 3
            },

            moreRich: {
                buttons: rich,
                align: 'left',
                buttonsVisible: 3
            },

            moreMisc: {
                buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
                align: 'right',
                buttonsVisible: 2
            }
        },
        fontFamily: {
            'Kanit': 'Kanit',
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            "'Times New Roman',Times,serif": 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana'
        },
        imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
        fontFamilyDefaultSelection: 'Kanit',
        fontFamilySelection: true,
        pastePlain: true,
        fontSizeSelection: true,
        fontSize: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '48', '60', '72', '96'],
        videoUpload: false,
        // Set the image upload parameter.
        imageUploadParam: 'image',

        // Set the image upload URL.
        imageUploadURL: `${BASE_URL}aws-file/upload/image`,//HOST + api.UPLOAD_IMAGE,

        // requestHeaders: {
        //     Authorization: 'bearer ' + this.token
        // },

        // Additional upload params.
        // imageUploadParams: {id: 'my_editor'},

        // Set request type.
        imageUploadMethod: 'POST',

        // Set max image size to 5MB.
        imageMaxSize: 4 * 1024 * 1024,

        // Allow to upload PNG and JPG.
        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],

        imagePaste: true,
        events: { // this in events is editor instance

            'image.uploaded': function (response) {

                const img = JSON.parse(response)
                const uploadedUrl = img.result[0].fileUrl
                const imgElement = this.image.get()
                const moreAttributes = {}
                moreAttributes.fileName = img.result[0].fileName
                moreAttributes.filePath = img.result[0].filePath

                this.image.insert(uploadedUrl, false, moreAttributes, imgElement)
                return false
            },

            'image.error': function (error, response) {

                // console.log('Error: ', error, response)

            },

            'image.removed': function ($img) {

                const src = $img[0].src
                const fileName = $img[0].dataset.filename
                const filePath = $img[0].dataset.filepath

                if (!src.includes('data:image') && fileName && filePath) {
                    onDeleteImage({
                        fileName,
                        filePath
                    })
                }

            }
        }
    }

    const handleModelChange = (model) => {
        setFieldValue(field.name, model)
    }

    return (
        <div className={"mt-3 " + className}>
            {props.label ? <label>{props.label} {required && <span className="text-danger">*</span>}</label> : ''}

            <FroalaEditorComponent
                tag='textarea'
                config={config}
                model={value}
                onModelChange={handleModelChange}
            />

            {isError && <div className="text-danger">{errors[field.name]}</div>}

        </div>
    )
}

export { FroalaEditor }
