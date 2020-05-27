import React, { Component } from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import { Box, dialog, ButtonApp, ImageDrop, Product360, Breadcrumb } from '../../../../components'
import { withAuth } from '../../../../services/auth'
import { Form, Field, Formik } from 'formik'
import { ChooseFile, TextField, FroalaEditor, Select } from '../../../../components/formik'
import FormikErrorFocus from 'formik-error-focus'
import api from '../../../../services/webservice'
import { PRODUCT_STATUS, ROLES } from '../../../../util/constants'
import { isEmpty } from '../../../../util/utilities'
import Router from 'next/router'
import { TagInput } from '../../../../components/formik/TagInput'
import { getExhibitorID } from '../..'


export class ProductItem extends Component {

    static async getInitialProps(ctx) {
        try {

            const exhibitorID = getExhibitorID(ctx)
            const productID = ctx.query.productId
            const res = await Promise.all([
                api.getProductDetail({ exhibitorID, productID }, ctx),
                api.getProductCategory(ctx),
                api.getProductLimit({ exhibitorID }, ctx)
            ])

            return {
                isCreating: productID === 'create',
                productID,
                exhibitorID,
                productDetail: res[0].data.result,
                limit: res[2].data.result,
                productCategories: res[1].data.result.categorie
            }
        } catch (error) {
            return {
                error,
                isCreating: true,
                productID: "",
                exhibitorID: "",
                productDetail: {},
                limit: {},
                productCategories: []
            }
        }
    }

    constructor(props) {
        super(props)
        const { productID, exhibitorID, productDetail, limit, productCategories } = props
        this.formikInfo = null
        this.loadRef = null
        this.delay = null
        this.state = {
            productID, exhibitorID, productDetail, productCategories, limit
        }
    }

    handelChangeFile = (fieldName) => (files) => {
        if (files.length > 0) {
            dialog.showLoading()
            api.uploadImage(files[0].imageFile).then(res => {
                this.formikInfo.setFieldValue(fieldName, res.data.result)
                dialog.showSuccessToast("Successfully uploaded")
            })
        }
    }

    onImageDelete = (removedFile) => {
        api.deleteFile(removedFile[0]).then(() => {
            dialog.showSuccessToast("Successfully deleted")
        })
    }

    onFroalaImageDelete = (fileMeta) => {
        api.deleteFile(fileMeta)
    }

    loadProductDetail = () => {
        const { exhibitorID, productID } = this.state
        return Promise.all([
            api.getProductDetail({ exhibitorID, productID }),
            api.getProductLimit({ exhibitorID })
        ]).then((res) => {
            this.setState({
                productDetail: res[0].data.result,
                limit: res[1].data.result
            })
        })
    }

    onPublish = () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to publish your product?',
            onConfirm: () => api.editProductStatus({ productID: this.state.productID, status: PRODUCT_STATUS.PUBLISH }).then(() => {
                this.loadProductDetail().then(() => {
                    dialog.showDialogSuccess({ showConfirmButton: false, message: 'Successfully published' })
                })
            })
        })
    }

    onUnpublish = () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to unpublish your product?',
            onConfirm: () => api.editProductStatus({ productID: this.state.productID, status: PRODUCT_STATUS.UNPUBLISH }).then(() => {
                this.loadProductDetail().then(() => {
                    dialog.showDialogSuccess({ showConfirmButton: false, message: 'Successfully unpublished' })
                })
            })
        })
    }

    onDelete = () => {
        const { productID } = this.state
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete your product?',
            onConfirm: () => {
                return api.deleteProduct({ productID }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            message: 'Successfully deleted',
                            showConfirmButton: false,
                            onClose: () => Router.back()
                        })
                    }, 250)
                })
            }
        })
    }

    saveOnChange = (values) => {
        if (this.delay) {
            clearTimeout(this.delay)
            this.delay = null
        }

        this.delay = setTimeout(() => {
            api.editProductInfo({
                ...values,
                cover: values.cover[0] || { fileUrl: '', fileName: '', filePath: '' }
            }).then(() => {
                setTimeout(() => {
                    dialog.showSuccessToast("Saved")
                }, 100)
            })
        }, 1250)
    }


    render() {
        const { account } = this.props
        const { exhibitorID, productID, productDetail, productCategories, limit: { limitProduct360, product360Count, limitProduct360Image } } = this.state
        const {
            id, name, cover, detail, category,
            categoryGroup, categorySubgroup, imageProduct360,
            imageProductGallery, status, keyword, productBrand,
            productsSpec, lotSize, certificate, is_product360
        } = productDetail
        const isProduct360NotOutOfQuota = limitProduct360 > product360Count

        console.log(123);
        

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Product Detail</h1>
                </div>

                {account.roleName === ROLES.EXHIBITOR ? (
                    <Breadcrumb
                        links={[
                            {
                                href: '/exhibitor/[id]',
                                label: 'Detail',
                                as: `/exhibitor/${exhibitorID}`,
                                active: false
                            }
                            , {
                                href: '/',
                                label: 'Edit product',
                                active: true
                            }
                        ]}
                    />
                ) : (
                        <Breadcrumb
                            links={[
                                {
                                    href: '/exhibitor',
                                    label: 'Exhibitors',
                                    active: false
                                }, {
                                    href: '/exhibitor/[id]',
                                    label: 'Detail',
                                    as: `/exhibitor/${exhibitorID}`,
                                    active: false
                                }
                                , {
                                    href: '/',
                                    label: 'Edit product',
                                    active: true
                                }
                            ]}
                        />
                    )}

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ position: 'relative' }}>
                                <li className="nav-item">
                                    <a className="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">Info</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="images-tab" data-toggle="tab" href="#images" role="tab" aria-controls="images" aria-selected="false">Image 360</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="gallery-tab" data-toggle="tab" href="#gallery" role="tab" aria-controls="gallery" aria-selected="false">Gallery</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="cert-tab" data-toggle="tab" href="#cert" role="tab" aria-controls="cert" aria-selected="false">Certificate</a>
                                </li>
                                <div style={{ position: 'absolute', right: 0 }}>
                                    {status === PRODUCT_STATUS.UNPUBLISH ? <ButtonApp isLoading={false} type="button" onClick={this.onPublish} className="btn-primary mr-1 px-3" >Publish</ButtonApp> : ''}
                                    {status === PRODUCT_STATUS.PUBLISH ? <ButtonApp isLoading={false} type="button" onClick={this.onUnpublish} className="btn-secondary mr-1 px-3" >Unpublish</ButtonApp> : ''}
                                    <ButtonApp isLoading={false} type="button" onClick={this.onDelete} className="btn-danger mr-1 px-3" >Delete</ButtonApp>
                                </div>
                            </ul>
                            <div className="tab-content" id="myTabContent">



                                <div className="tab-pane fade show active pt-3" id="info" role="tabpanel" aria-labelledby="info-tab">
                                    <Formik

                                        initialValues={{
                                            productID: id,
                                            name: name || "",
                                            productBrand: productBrand || "",
                                            productsSpec: productsSpec || "",
                                            lotSize: lotSize || "",
                                            detail: detail || "",
                                            cover: cover && cover.fileUrl ? [{ ...cover }] : [],
                                            categoryID: category && category.id ? category.id : "",
                                            categoryGroupID: categoryGroup && categoryGroup.id ? categoryGroup.id : "",
                                            categorySubgroupID: categorySubgroup && categorySubgroup.id ? categorySubgroup.id : "",
                                            category: category && category.id ? category : { id: null, name: null },
                                            categoryGroup: categoryGroup && categoryGroup.id ? categoryGroup : { id: null, name: null },
                                            categorySubgroup: categorySubgroup && categorySubgroup.id ? categorySubgroup : { id: null, name: null },
                                            keyword: keyword && keyword.length > 0 ? keyword : []
                                        }}
                                        validateOnBlur={false}
                                        validate={(values) => {

                                            const errors = {}
                                            const required = ['name', 'categoryID']

                                            required.forEach(field => {
                                                if (!values[field]) {
                                                    errors[field] = "Required"
                                                }
                                            })

                                            if (isEmpty(errors)) {
                                                this.saveOnChange(values)
                                            }

                                            return errors
                                        }}

                                        onSubmit={(values) => {

                                        }}
                                    >

                                        {(formik) => {

                                            this.formikInfo = formik

                                            let categoryGroupOptions = []
                                            const findCat = productCategories.find(cat => cat.id === formik.values.categoryID)
                                            if (findCat) {
                                                categoryGroupOptions = findCat.categorieGroup
                                            }

                                            let categorySubGroupOptions = []
                                            const findCatGroup = categoryGroupOptions.find(sub => sub.id === formik.values.categoryGroupID)
                                            if (findCatGroup) {
                                                categorySubGroupOptions = findCatGroup.categorieSubgroup
                                            }

                                            return (
                                                <Form>
                                                    <div className="col-lg-12 mb-3">
                                                        <Field label="Product Name" name="name" component={TextField} />
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <Field label="Product Brand" name="productBrand" component={TextField} />
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <Field label="Product Spec." name="productsSpec" component={TextField} />
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <Field label="Lot Size" name="lotSize" component={TextField} />
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <Field onChange={e => {
                                                            const catID = e.target.value
                                                            const cat = productCategories.find(cat => cat.id === catID)
                                                            const catValue = cat ? { id: cat.id, name: cat.name } : { id: null, name: null }
                                                            formik.setValues({
                                                                ...formik.values,
                                                                categoryID: catID,
                                                                categoryGroupID: "",
                                                                categorySubgroupID: "",
                                                                category: catValue,
                                                                categoryGroup: { id: null, name: null },
                                                                categorySubgroup: { id: null, name: null },
                                                            })
                                                        }} name="categoryID" label="Category" component={Select} options={productCategories} isMultiLang={false} idFieldName="id" labelFieldName="name" />
                                                    </div>

                                                    {formik.values.categoryID && categoryGroupOptions.length > 0 ? (
                                                        <div className="col-lg-12 mb-3">
                                                            <Field onChange={e => {
                                                                const groupID = e.target.value
                                                                const group = categoryGroupOptions.find(group => group.id === groupID)
                                                                const groupValue = group ? { id: group.id, name: group.name } : { id: null, name: null }
                                                                formik.setValues({
                                                                    ...formik.values,
                                                                    categoryGroupID: groupID,
                                                                    categoryGroup: groupValue,
                                                                    categorySubgroupID: "",
                                                                    categorySubgroup: { id: null, name: null }
                                                                })
                                                            }} name="categoryGroupID" label="Category 2" component={Select} options={categoryGroupOptions} isMultiLang={false} idFieldName="id" labelFieldName="name" />
                                                        </div>
                                                    ) : ''}

                                                    {formik.values.categoryGroupID && categorySubGroupOptions.length > 0 ? (
                                                        <div className="col-lg-12 mb-3">
                                                            <Field onChange={e => {
                                                                const subID = e.target.value
                                                                const sub = categorySubGroupOptions.find(sub => sub.id === subID)
                                                                const subValue = sub ? { id: sub.id, name: sub.name } : { id: null, name: null }
                                                                formik.setFieldValue('categorySubgroup', subValue)
                                                            }} name="categorySubgroupID" label="Category 3" component={Select} options={categorySubGroupOptions} isMultiLang={false} idFieldName="id" labelFieldName="name" />
                                                        </div>
                                                    ) : ''}

                                                    <div className="col-lg-12 mb-3">
                                                        <Field label="Product keyword" name="keyword" component={TagInput} className="input-group pl-0" />
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <Field label="Product Cover Image" name="cover" component={ChooseFile} className="input-group pl-0" onChange={this.handelChangeFile('cover')} onRemove={this.onImageDelete} deleteMessage="Are you sure you want to delete the product cover image?" />
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <Field name="detail" label="Product Detail" component={FroalaEditor} onDeleteImage={this.onFroalaImageDelete} />
                                                    </div>

                                                    <FormikErrorFocus
                                                        offset={-40}
                                                        align={'top'}
                                                        focusDelay={0}
                                                        ease={'linear'}
                                                        duration={200}
                                                    />
                                                </Form>
                                            )
                                        }}
                                    </Formik>


                                </div>


                                <div className="tab-pane fade" id="images" role="tabpanel" aria-labelledby="images-tab">
                                    <div className="row pt-3">
                                        <div className="col-lg-12 mb-3 ">
                                            {is_product360 || (!is_product360 && isProduct360NotOutOfQuota) ? (
                                                <ImageDrop
                                                    previewGallery={true}
                                                    oldFiles={imageProduct360}

                                                    onSorted={sortedImgs => {
                                                        api.editProduct360Image({ productID, status, imageProduct360: sortedImgs }).then(() => {
                                                            dialog.showSuccessToast("Saved")
                                                        })
                                                    }}

                                                    onAddFile={({ acceptedFiles, uploadedFiles }) => {
                                                        const fileToUpload = acceptedFiles.splice(0)

                                                        if (fileToUpload.length + uploadedFiles.length > limitProduct360Image) {
                                                            dialog.showDialogWarning({
                                                                message: 'You have reached the maximum number of product images ' + `(${limitProduct360Image}).`
                                                            })
                                                        } else {
                                                            dialog.showLoading()
                                                            Promise.all(
                                                                fileToUpload.map(file => {
                                                                    return api.upload360Image(file, productID)
                                                                })
                                                            ).then(res => {
                                                                const newImgs = [...uploadedFiles, ...res.map(({ data }) => {
                                                                    return data.result[0]
                                                                })]
                                                                api.editProduct360Image({ productID, status, imageProduct360: newImgs }).then(() => {
                                                                    this.loadProductDetail()
                                                                        .then(() => {
                                                                            dialog.showSuccessToast("Successfully uploaded")
                                                                        })
                                                                })
                                                            })
                                                        }
                                                    }}

                                                    onDelete={({ fileToDelete, uploadedFiles }) => {
                                                        const imgID = fileToDelete.id
                                                        const index = uploadedFiles.findIndex(file => file.id === imgID)
                                                        if (index !== -1) {
                                                            dialog.showDialogConfirm({
                                                                message: 'Are you sure you want to delete the product image?',
                                                                onConfirm: () => {
                                                                    uploadedFiles.splice(index, 1)
                                                                    return api.deleteFile(fileToDelete).then(() => {
                                                                        api.editProduct360Image({ productID, status, imageProduct360: uploadedFiles }).then(() => {
                                                                            this.loadProductDetail()
                                                                                .then(() => {
                                                                                    dialog.showDialogSuccess({
                                                                                        showConfirmButton: false,
                                                                                        message: 'Product image successfully deleted.'
                                                                                    })
                                                                                })
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    onClear={(images) => {
                                                        dialog.showDialogConfirm({
                                                            confirmButtonText: 'Clear',
                                                            message: 'Are you sure you want to delete all product images?',
                                                            onConfirm: () => Promise.all([
                                                                ...images.map(img => {
                                                                    return api.deleteFile(img)
                                                                }),
                                                                api.editProduct360Image({ productID, status, imageProduct360: [] })
                                                            ]).then(() => {
                                                                this.loadProductDetail()
                                                                dialog.showDialogSuccess({
                                                                    showConfirmButton: false,
                                                                    message: 'All product images successfully deleted.'
                                                                })
                                                            })
                                                        })
                                                    }}
                                                    PreviewComponent={(props) => (
                                                        <div className="rounded border container-preview-product">
                                                            {/* <h3 className="text-center" style={{ marginTop: "100px" }}>Preview 360 image</h3> */}
                                                            <Product360 images={props.images} />
                                                        </div>
                                                    )}
                                                />
                                            ) : (
                                                    <div style={{ height: '45vh' }} className="d-flex align-items-center justify-content-center">
                                                        <h2 className="text-center">{`You have reached the maximum  number of products(${limitProduct360}) that can be created under your account.`}</h2>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                </div>




                                <div className="tab-pane fade" id="gallery" role="tabpanel" aria-labelledby="gallery-tab">
                                    <div className="row pt-3">
                                        <div className="col-lg-12 mb-3">
                                            <ImageDrop
                                                oldFiles={imageProductGallery}

                                                onSorted={sortedImgs => {
                                                    api.editProductGallery({ productID, status, imageProductGallery: sortedImgs }).then(() => {
                                                        dialog.showSuccessToast("Saved")
                                                    })
                                                }}

                                                onAddFile={({ acceptedFiles, uploadedFiles }) => {
                                                    const fileToUpload = acceptedFiles.splice(0)
                                                    dialog.showLoading()
                                                    Promise.all(
                                                        fileToUpload.map(file => {
                                                            return api.uploadImage(file)
                                                        })
                                                    ).then(res => {
                                                        const newImgs = [...uploadedFiles, ...res.map(({ data }) => {
                                                            return data.result[0]
                                                        })]
                                                        api.editProductGallery({ productID, status, imageProductGallery: newImgs }).then(() => {
                                                            this.loadProductDetail()
                                                                .then(() => {
                                                                    dialog.showSuccessToast("Successfully uploaded")
                                                                })
                                                        })
                                                    })
                                                }}

                                                onDelete={({ fileToDelete, uploadedFiles }) => {
                                                    const imgID = fileToDelete.id
                                                    const index = uploadedFiles.findIndex(file => file.id === imgID)
                                                    if (index !== -1) {
                                                        dialog.showDialogConfirm({
                                                            message: 'Are you sure you want to delete the product image?',
                                                            onConfirm: () => {
                                                                uploadedFiles.splice(index, 1)
                                                                return api.deleteFile(fileToDelete).then(() => {
                                                                    api.editProductGallery({ productID, status, imageProductGallery: uploadedFiles }).then(() => {
                                                                        this.loadProductDetail()
                                                                            .then(() => {
                                                                                dialog.showDialogSuccess({
                                                                                    showConfirmButton: false,
                                                                                    message: 'Product image successfully deleted.'
                                                                                })
                                                                            })
                                                                    })
                                                                })
                                                            }
                                                        })
                                                    }
                                                }}

                                                onClear={(images) => {
                                                    dialog.showDialogConfirm({
                                                        message: 'Are you sure you want to delete all  product images?',
                                                        confirmButtonText: "Clear",
                                                        onConfirm: () => Promise.all([
                                                            ...images.map(img => {
                                                                return api.deleteFile(img)
                                                            }),
                                                            api.editProductGallery({ productID, status, imageProductGallery: [] })
                                                        ]).then(() => {
                                                            this.loadProductDetail()
                                                                .then(() => {
                                                                    dialog.showDialogSuccess({
                                                                        message: 'Gallery successfully deleted.',
                                                                        showConfirmButton: false
                                                                    })
                                                                })
                                                        })
                                                    })
                                                }}

                                            />
                                        </div>
                                    </div>

                                </div>




                                <div className="tab-pane fade" id="cert" role="tabpanel" aria-labelledby="cert-tab">
                                    <div className="row pt-3">
                                        <div className="col-lg-12 mb-3">
                                            <ImageDrop
                                                oldFiles={certificate}

                                                onSorted={sortedImgs => {
                                                    api.editProductCertificate({ productID, status, certificate: sortedImgs }).then(() => {
                                                        dialog.showSuccessToast("Saved")
                                                    })
                                                }}

                                                onAddFile={({ acceptedFiles, uploadedFiles }) => {
                                                    const fileToUpload = acceptedFiles.splice(0)
                                                    dialog.showLoading()
                                                    Promise.all(
                                                        fileToUpload.map(file => {
                                                            return api.uploadImage(file)
                                                        })
                                                    ).then(res => {
                                                        const newImgs = [...uploadedFiles, ...res.map(({ data }) => {
                                                            return data.result[0]
                                                        })]
                                                        api.editProductCertificate({ productID, status, certificate: newImgs }).then(() => {
                                                            this.loadProductDetail()
                                                                .then(() => {
                                                                    dialog.showSuccessToast("Successfully uploaded")
                                                                })
                                                        })
                                                    })
                                                }}

                                                onDelete={({ fileToDelete, uploadedFiles }) => {
                                                    const imgID = fileToDelete.id
                                                    const index = uploadedFiles.findIndex(file => file.id === imgID)
                                                    if (index !== -1) {
                                                        dialog.showDialogConfirm({
                                                            message: 'Are you sure you want to delete the certificate?',
                                                            onConfirm: () => {
                                                                uploadedFiles.splice(index, 1)
                                                                return api.deleteFile(fileToDelete).then(() => {
                                                                    api.editProductCertificate({ productID, status, certificate: uploadedFiles }).then(() => {
                                                                        this.loadProductDetail()
                                                                            .then(() => {
                                                                                dialog.showDialogSuccess({
                                                                                    showConfirmButton: false,
                                                                                    message: 'Certificate successfully deleted.'
                                                                                })
                                                                            })
                                                                    })
                                                                })
                                                            }
                                                        })
                                                    }
                                                }}

                                                onClear={(images) => {
                                                    dialog.showDialogConfirm({
                                                        message: 'Are you sure you want to delete all certificates?',
                                                        confirmButtonText: 'Clear',
                                                        onConfirm: () => Promise.all([
                                                            ...images.map(img => {
                                                                return api.deleteFile(img)
                                                            }),
                                                            api.editProductCertificate({ productID, status, certificate: [] })
                                                        ]).then(() => {
                                                            this.loadProductDetail()
                                                                .then(() => {
                                                                    dialog.showDialogSuccess({
                                                                        showConfirmButton: false,
                                                                        message: 'All certificates successfully deleted.'
                                                                    })
                                                                })
                                                        })
                                                    })
                                                }}

                                            />
                                        </div>
                                    </div>

                                </div>



                            </div>
                        </Box>
                    </div>

                </div>

            </MainLayout>
        )
    }

}


export default withAuth(ProductItem, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
