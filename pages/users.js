import React, { Component } from 'react'
import MainLayout from '../components/layout/MainLayout'
import { Box, Pagination, dialog, JqModal } from '../components'
import { Select, TextField, TextArea } from '../components/formik'
import { Form, Field, Formik } from 'formik'
import api from '../services/webservice'
import { validateEmail } from '../util/utilities'
import { withAuth } from '../services/auth'
import { ALL_ROLES, ROLES } from '../util/constants'

const emptyUser = {
    account_id: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    note: ''
}

const pageSize = 5

export class Users extends Component {

    static async getInitialProps(ctx) {
        try {
            const usrRes = await api.getAccount({ page: 1, count: pageSize, keyword: "" }, ctx)
            const roleRes = await api.getAccountRole(ctx)

            return {
                accounts: usrRes.data.result.accountList,
                total: usrRes.data.result.total,
                roles: roleRes.data.result
            }

        } catch (error) {
            return {
                error,
                accounts: [],
                roles: [],
                total: 1
            }
        }
    }

    constructor(props) {
        super(props)
        this.delay = null
        const { accounts, roles, total } = props
        this.state = {
            formik: {
                account_id: '',
                email: '',
                firstName: '',
                lastName: '',
                role: '',
                note: ''
            },
            accounts: this.formatAccountList(accounts),
            roles,
            total,
            page: 1,
            keyword: ""
        }
    }

    onSubmitUser = (values, actions) => {
        dialog.showDialogConfirm({
            message: values.account_id ? 'Are you sure you want to update this user account?' : 'Are you sure you want to create user?',
            onConfirm: () => {
                if (values.account_id) {
                    return api.editAccount(values).then(() => {
                        setTimeout(() => {
                            dialog.showDialogSuccess({ 
                                showConfirmButton: false,
                                message: 'User account successfully updated.' 
                            })
                            actions.resetForm()
                            this.modal.close()
                            this.loadUsers()
                        }, 250)
                    })
                } else {
                    return api.createAccount(values).then(() => {
                        setTimeout(() => {
                            dialog.showDialogSuccess({
                                showConfirmButton: false,
                                message: "User account has been created successfully."
                            })
                            actions.resetForm()
                            this.modal.close()
                            this.loadUsers()
                        }, 250)
                    })
                }
            }
        })
    }

    reSendInvite = (user) => () => {
        api.sendInvite(user).then(() => {
            dialog.showDialogSuccess({ 
                message:'Invitation Email successfully resent.',
                showConfirmButton: false 
            })
        })
    }

    onRemoveUser = (user) => () => {
        dialog.showDialogConfirm({
            message:'Are you sure you want to delete this user account?',
            onConfirm: () => api.deleteAccount(user).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        message:'User account successfully deleted.',
                        showConfirmButton: false
                    })
                    this.loadUsers()
                }, 250)
            })
        })
    }

    onEditUser = (user) => () => {
        this.setState({ formik: { ...user } }, () => {
            this.modal.show()
        })
    }

    onNewUser = () => {
        this.setState({ formik: { ...emptyUser } }, () => {
            this.modal.show()
        })
    }

    onCancelUserModal = (formik) => () => {
        if (formik.dirty) {
            dialog.showDialogConfirm({
                message: "Discard all changes?",
                onConfirm: () => {
                    formik.resetForm({})
                    this.modal.close()
                }
            })
        } else {
            formik.resetForm({})
            this.modal.close()
        }
    }

    onPageClick = (selectedPage) => {
        this.setState({ page: selectedPage })
    }

    onSearch = e => {
        this.setState({ keyword: e.target.value, page: 1 })
    }

    loadUsers = () => {
        const { keyword, page } = this.state
        api.getAccount({
            keyword, page, count: pageSize
        }).then(res => {
            const { accountList, total } = res.data.result
            this.setState({ accounts: this.formatAccountList(accountList), total })
        })
    }

    formatAccountList = (list) => {
        return list.map(acc => ({
            firstName: acc.userFname,
            lastName: acc.userLname,
            account_id: acc.accountID,
            role: acc.role,
            email: acc.userEmail,
            note: acc.note,
            imageProfile: acc.imageProfile.fileUrl,
            status: acc.status
        }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.keyword !== this.state.keyword) {
            if (this.delay) {
                clearTimeout(this.delay)
                this.delay = null
            }

            this.delay = setTimeout(() => {
                this.loadUsers()
            }, 250)
        } else if (prevState.page !== this.state.page) {
            this.loadUsers()
        }
    }


    render() {

        const { formik: { email, firstName, account_id, lastName, note, role }, accounts, roles, keyword, total, page } = this.state

        const showRoles = {}
        roles.forEach(r => {
            showRoles[r.id] = r.roleName
        })

        return (
            <MainLayout {...this.props}>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">User & Role</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>

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
                                    <button className="btn btn-block btn-danger my-3" onClick={this.onNewUser}><i className="fas fa-plus mr-1" />New</button>
                                </div>
                            </div>


                            <div className="table-responsive">
                                <ul className="list-unstyled">
                                    {accounts.map(usr => {
                                        return (
                                            <li className="media border hover-box-shadow p-2 mb-2" style={{ minWidth: '500px' }} key={usr.account_id}>
                                                <img className="mr-3 border list-img" src={usr.imageProfile || '../static/img/ic_default_user.png'} alt="account image" />
                                                <div className="media-body">
                                                    <h5 className="mt-0 mb-1 font-weight-bold">{usr.firstName} {usr.lastName}</h5>
                                                    <div className="row">
                                                        <div className="col-12"><strong className="mr-1">Role:</strong>{showRoles[usr.role]}</div>
                                                        <div className="col-12"><strong className="mr-1">Email:</strong>{usr.email}</div>
                                                        <div className="col-12"><strong className="mr-1">Detail:</strong>{usr.note}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button type="button" disabled={!(usr.status === 'invite')} className="btn btn-danger" title="Re-Invite" onClick={this.reSendInvite(usr)}>
                                                            <i className="fas fa-envelope"></i>
                                                        </button>
                                                        <button type="button" className="btn btn-danger" title="Remove" onClick={this.onRemoveUser(usr)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                        <button type="button" className="btn btn-danger" title="Edit" onClick={this.onEditUser(usr)}>
                                                            <i className="fas fa-pen"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            <div className="col-md-12 p3">
                                <Pagination pageSize={pageSize} length={3} currentPage={page} total={total} onClick={this.onPageClick} />
                            </div>

                        </Box>
                    </div>

                </div>

                <JqModal ref={ref => this.modal = ref} title={account_id ? "Edit User" : "Add User"}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            account_id,
                            email,
                            firstName,
                            lastName,
                            role,
                            note
                        }}
                        validate={values => {

                            const requires = ['email', 'firstName', 'lastName', 'role']
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
                            this.onSubmitUser(value, actions)
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
                                            <Field name='role' label={'Role:'} required component={Select} options={roles} isMultiLang={false} labelFieldName='roleName' idFieldName='id' />
                                        </div>
                                        <div className="form-group col-lg-12">
                                            <Field name='note' label={'Note:'} component={TextArea} className="form-control" />
                                        </div>
                                        <div className="form-group col-lg-12 text-center">
                                            <button type="button" onClick={formik.handleSubmit} className="btn btn-danger mr-2">{account_id ? "Save" : "Create"}</button>
                                            <button type="button" onClick={this.onCancelUserModal(formik)} className="btn btn-secondary">Cancel</button>
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

export default withAuth(Users, [ROLES.ORGANIZER, ROLES.SUPER_ADMIN])
