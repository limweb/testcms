import React, { Component } from 'react'
import ExhibitorNav from '../../../../components/layout/exhibitor-nav'
import MainLayout from '../../../../components/layout/MainLayout'
import { Box, Pagination, JqModal, ButtonApp, dialog, Breadcrumb } from '../../../../components'
import Link from 'next/link'
import { withAuth } from '../../../../services/auth'
import { Form, Field, Formik } from 'formik'
import { Select, TextField } from '../../../../components/formik'
import api from '../../../../services/webservice'
import Router from 'next/router'
import { PRODUCT_STATUS, ROLES } from '../../../../util/constants'
import { capitalize } from '../../../../util/utilities'
import { getExhibitorID } from '../..'

const count = 5

export class Product extends Component {

    static async getInitialProps(ctx) {

        try {
            const exhibitorID = getExhibitorID(ctx)

            const res = await Promise.all([
                api.getProducts({ keyword: "", page: 1, exhibitorID, count }, ctx),
                api.getProductLimit({ exhibitorID }, ctx)
            ])

            const { productList, total } = res[0].data.result
            const limit = res[1].data.result

            return {
                exhibitorID,
                total,
                productList,
                limit
            }
        } catch (error) {
            return {
                error,
                exhibitorID: "",
                total: 0,
                productList: [],
                limit: {}
            }
        }
    }

    constructor(props) {
        super(props)
        this.modal
        this.delay
        this.state = {
            exhibitorID: props.exhibitorID,
            keyword: "",
            page: 1,
            total: props.total,
            productList: props.productList,
            limit: props.limit
        }
    }

    onRemoveProduct = (product) => () => {
        dialog.showDialogConfirm({
            onConfirm: () => {
                return api.deleteProduct({ productID: product.id }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            onClose: () => this.loadProducts()
                        })
                    }, 250);
                })
            }
        })
    }

    onSubmitNewProduct = (values, actions) => {
        const { exhibitorID } = this.state
        api.createProduct({ exhibitorID, ...values }).then(() => {
            this.modal.close()
            actions.resetForm()
            setTimeout(() => {
                dialog.showDialogSuccess({
                    showConfirmButton: false,
                    onClose: () => this.loadProducts(),
                    message: 'Product successfully created.'
                })
            }, 250)
        })
    }

    onCancelProductModal = (formik) => () => {
        formik.resetForm()
        this.modal.close()
    }

    onCreateProduct = () => {
        this.modal.show()
    }

    onPageSelect = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value, page: 1 })
    }

    loadProducts = () => {
        const { keyword, page, exhibitorID } = this.state
        return Promise.all([
            api.getProducts({ keyword, page, exhibitorID, count }),
            api.getProductLimit({ exhibitorID })
        ]).then(res => {
            const { productList, total } = res[0].data.result
            const limit = res[1].data.result
            this.setState({ productList, total, limit })
        })
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }
            this.delay = setTimeout(() => {
                this.loadProducts()
            }, 400)
        } else if (prevStates.page !== this.state.page) {
            this.loadProducts()
        }
    }

    render() {
        const { account } = this.props
        const { keyword, page, total, productList, exhibitorID, limit: { productAllCount, limitProduct360, limitProduct } } = this.state
        const isProductOutOfQuota = (limitProduct + limitProduct360) <= productAllCount
        const links = [
            {
                href: '/exhibitor',
                label: 'Exhibitors',
                active: false
            }, {
                href: '/',
                label: 'Detail',
                active: true
            }
        ]

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">Exhibitor Detail</h1>
                </div>
                {account.roleName !== ROLES.EXHIBITOR ? (
                    <Breadcrumb links={links} />
                ) : <div className="mb-4" />}

                <div className="row">

                    <div className="col-md-12">
                        <Box>

                            {account.roleName !== ROLES.EXHIBITOR ? (
                                <ExhibitorNav currentTab="product" exhibitorId={exhibitorID} />
                            ) : ''}

                            <div className="row ">
                                <div className="input-group col-md-6 my-3">
                                    <input value={keyword} onChange={this.onSearch} type="text" className="form-control bg-light border small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-danger" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-3 col-lg-4" />

                                <div className="col-md-3 col-lg-2">
                                    <button disabled={isProductOutOfQuota} className="btn btn-block btn-danger my-3" onClick={this.onCreateProduct}><i className="fas fa-plus mr-1"></i>Create</button>
                                </div>
                            </div>


                            <ul className="list-unstyled">
                                {productList.map(item => {
                                    return (
                                        <li className="media border hover-box-shadow p-2 mb-2" style={{ minWidth: '500px' }} key={item.id}>
                                            <img className="mr-3 border list-img" src={item.cover.fileUrl || '../../../../static/img/noimage.jpg'} alt="account image" />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1 font-weight-bold">{item.name}</h5>
                                                <div className="row">
                                                    {/* <div className="col-12"><strong className="mr-1">Product owner:</strong>{item.productOwner}</div> */}
                                                    <div className="col-12"><strong className="mr-1">Status:</strong>
                                                        <span className={`${item.status === PRODUCT_STATUS.PUBLISH ? 'text-success' : ''}`}>{capitalize(item.status)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button type="button" className="btn btn-danger" title="Remove" onClick={this.onRemoveProduct(item)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <Link href="/exhibitor/[id]/product/[productId]" as={`/exhibitor/${exhibitorID}/product/${item.id}`}>
                                                        <a className="btn btn-danger" title="Edit">
                                                            <i className="fas fa-pen"></i>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="col-md-12 p3">
                                <Pagination pageSize={count} length={3} currentPage={page} total={total} onClick={this.onPageSelect} />
                            </div>
                        </Box>
                    </div>

                </div>


                <JqModal ref={ref => this.modal = ref} title="Create Product">
                    <Formik

                        initialValues={{
                            name: ""
                        }}
                        validateOnBlur={false}
                        validate={(values) => {
                            const errors = {}
                            const required = ['name']

                            required.forEach(field => {
                                if (!values[field]) {
                                    errors[field] = "Required"
                                }
                            })

                            return errors
                        }}

                        onSubmit={(values, actions) => {
                            this.onSubmitNewProduct(values, actions)
                        }}
                    >

                        {(formik) => {
                            return (
                                <Form className="p-3 mb-3">
                                    <div className="col-lg-12 mb-2">
                                        <Field label="Product Name" name="name" component={TextField} required />
                                    </div>

                                    <div className="col-lg-12 text-center">
                                        <button type="button" onClick={formik.handleSubmit} className="btn btn-danger px-3 mr-2" >Create</button>
                                        <button type="button" onClick={this.onCancelProductModal(formik)} className="btn btn-secondary px-3" >Cancel</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </JqModal>


            </MainLayout>
        )
    }
}

export default withAuth(Product, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
