import React, { Component } from 'react'
import ExhibitorNav from '../../../../components/layout/exhibitor-nav'
import MainLayout from '../../../../components/layout/MainLayout'
import Link from 'next/link'
import { Box, Pagination, dialog, JqModal, Breadcrumb } from '../../../../components'
import { withAuth } from '../../../../services/auth'
import api from '../../../../services/webservice'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from '../../../../components/formik'
import { validateEmail } from '../../../../util/utilities'
import { ROLES } from '../../../../util/constants'
import { getExhibitorID } from '../..'

const count = 5

export class Account extends Component {

    static async getInitialProps(ctx) {

        try {
            const exhibitorID = getExhibitorID(ctx)
            const res = await Promise.all([
                api.getStaff({ keyword: '', page: 1, count, exhibitorID }, ctx),
                api.getExhibitorDetail({ exhibitorID }, ctx),
                api.getCountry(ctx),
            ])

            const exhibitorDetail = res[1].data.result
            const { accountList, total, exhibitorStaffLimit, countExhibitorStaff } = res[0].data.result
            const countries = res[2].data.result

            return {
                exhibitorID,
                exhibitorDetail,
                total,
                accountList,
                countries,
                exhibitorStaffLimit,
                countExhibitorStaff
            }
        } catch (error) {
            return {
                error,
                exhibitorID: "",
                exhibitorDetail: {},
                total: 0,
                accountList: [],
                countries: [],
                countExhibitorStaff: 0,
                exhibitorStaffLimit: 0
            }
        }
    }

    constructor(props) {
        super(props)
        this.delay = null
        this.modal = null
        this.state = {
            keyword: "",
            accountList: props.accountList,
            total: props.total,
            page: 1,
            exhibitorID: props.exhibitorID,
            exhibitorDetail: props.exhibitorDetail,
            exhibitorStaffLimit: props.exhibitorStaffLimit,
            countExhibitorStaff: props.countExhibitorStaff
        }
    }


    onPageClick = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value, page: 1 })
    }

    showModal = () => {
        if (this.modal) {
            this.modal.show()
        }
    }

    cancelModal = (formik) => () => {
        if (this.modal) {
            this.modal.close()
            formik.resetForm()
        }
    }

    onAddNewUser = (values) => {
        const { exhibitorDetail, exhibitorID } = this.state
        api.createStaff({
            ...values,
            exhibitorID,
            companyName: exhibitorDetail.companyName
        }).then(() => {
            dialog.showDialogSuccess({
                showConfirmButton: false,
                onClose: () => {
                    this.modal.close()
                    this.loadStaff()
                },
                message: 'Successfully created.'
            })
        })
    }

    loadStaff = () => {
        const { keyword, page, exhibitorID } = this.state
        return Promise.all([
            api.getStaff({ keyword, page, count, exhibitorID }),
            api.getExhibitorDetail({ exhibitorID }),
        ]).then(res => {
            const exhibitorDetail = res[1].data.result
            const { accountList, total, countExhibitorStaff, exhibitorStaffLimit } = res[0].data.result
            this.setState({
                exhibitorDetail, accountList, total, countExhibitorStaff, exhibitorStaffLimit
            })
        })


    }

    reSendInvite = (user) => () => {
        api.sendInviteStaff({ exhibitorStaffID: user.exhibitorStaffID }).then(() => {
            dialog.showDialogSuccess({ showConfirmButton: false })
        })
    }

    onDeleteStaff = (user) => () => {
        dialog.showDialogConfirm({
            message: "Are you sure you want to delete the Exhibitor staff? The staff will lost all chat history.",
            onConfirm: () => api.deleteStaff({ exhibitorStaffID: user.exhibitorStaffID }).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        message: 'Successfully deleted.',
                        showConfirmButton: false
                    })
                    this.loadStaff()
                }, 250)
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }

            this.delay = setTimeout(() => {
                this.loadStaff()
            }, 250)
        } else if (prevState.page !== this.state.page) {
            this.loadStaff()
        }
    }

    render() {
        const { account } = this.props
        const { keyword, page, accountList, total, exhibitorID, exhibitorDetail, countExhibitorStaff, exhibitorStaffLimit } = this.state
        const country = this.props.countries.find(c => c.nameEn === exhibitorDetail.countryName)
        const isStaffFull = exhibitorStaffLimit <= countExhibitorStaff
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
                                <ExhibitorNav currentTab="account" exhibitorId={this.props.exhibitorID} />
                            ) : ''}

                            <div className="row ">
                                <div className="input-group col-md-6 my-3">
                                    <input onChange={this.onSearch} value={keyword} type="text" className="form-control bg-light border small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-danger" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-3 col-lg-4" />

                                <div className="col-md-3 col-lg-2">
                                    <button disabled={isStaffFull} onClick={this.showModal} className="btn btn-block btn-danger my-3"><i className="fas fa-plus mr-1" />Create</button>
                                </div>
                            </div>


                            <ul className="list-unstyled">
                                {accountList.map(usr => {

                                    return (
                                        <li className="media border hover-box-shadow p-2 mb-2" style={{ minWidth: '500px' }} key={usr.exhibitorStaffID}>
                                            <img className="mr-3 border list-img" src={usr.imageProfile.fileUrl || '../../../../static/img/ic_default_user.png'} alt="user image" />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1 font-weight-bold">{usr.userFname} {usr.userLname}</h5>
                                                <div className="row">
                                                    <div className="col-12"><strong className="mr-1">Phone:</strong>{usr.phone}</div>
                                                    <div className="col-12"><strong className="mr-1">Email:</strong>{usr.userEmail}</div>
                                                    <div className="col-12"><strong className="mr-1">Position:</strong>{usr.position}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button type="button" disabled={!(usr.status === 'invite')} className="btn btn-danger" title="Re-Invite" onClick={this.reSendInvite(usr)}>
                                                        <i className="fas fa-envelope"></i>
                                                    </button>
                                                    <button type="button" className="btn btn-danger" title="Remove" onClick={this.onDeleteStaff(usr)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <Link href="/exhibitor/[id]/account/[accountId]" as={`/exhibitor/${exhibitorID}/account/${usr.exhibitorStaffID}`}>
                                                        <a type="button" className="btn btn-danger" title="Edit">
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
                                <Pagination pageSize={count} length={3} currentPage={page} total={total} onClick={this.onPageClick} />
                            </div>


                        </Box>
                    </div>

                </div>

                <JqModal ref={ref => this.modal = ref} title="Create Staff">
                    <Formik
                        enableReinitialize
                        initialValues={{
                            email: "",
                            firstName: "",
                            lastName: "",
                            position: "",
                            phone: "",
                            countryID: country ? country.countryID : ""
                        }}
                        validate={values => {

                            const requires = ['email', 'firstName', 'lastName', 'position', 'phone', 'countryID']
                            let errors = {};

                            if (values['email'] && !validateEmail(values['email'])) {
                                errors['email'] = 'Invalid email format.';
                            }

                            requires.forEach(field => {
                                if (!values[field]) {
                                    errors[field] = 'Required';
                                }
                            })

                            return errors;
                        }}
                        onSubmit={(value, actions) => {
                            this.onAddNewUser(value, actions)
                        }}

                    >
                        {(formik) => {
                            return (
                                <Form>
                                    <div className="row p-3">
                                        <div className="form-group col-lg-12">
                                            <Field name='email' label={'Email Address:'} required component={TextField} type="text" className="form-control" />
                                        </div>
                                        <div className="form-group col-lg-12">
                                            <Field name='firstName' label={'First Name:'} required type="text" component={TextField} className="form-control" />
                                        </div>
                                        <div className="form-group col-lg-12">
                                            <Field name='lastName' label={'Last Name:'} required type="text" component={TextField} className="form-control" />
                                        </div>
                                        <div className="form-group col-lg-12">
                                            <Field name='phone' label={'Phone:'} required component={TextField} type="text" className="form-control" />
                                        </div>
                                        <div className="form-group col-lg-12">
                                            <Field name='position' label={'Position:'} required type="text" component={TextField} className="form-control" />
                                        </div>
                                        <div className="form-group col-lg-12">
                                            <Field name='countryID' label={'Country:'} required type="text" component={Select} options={this.props.countries} className="form-control" idFieldName="countryID" labelFieldName="nameEn" isMultiLang={false} />
                                        </div>
                                        <div className="form-group col-lg-12 text-center">
                                            <button type="button" onClick={formik.handleSubmit} className="btn btn-danger mr-2">Create</button>
                                            <button type="button" onClick={this.cancelModal(formik)} className="btn btn-secondary">Cancel</button>
                                        </div>
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

export default withAuth(Account, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
