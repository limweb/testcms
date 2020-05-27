import React, { Component, Fragment } from 'react'
import { withAuth } from '../services/auth'
import { ROLES, MAIN_SCREEN_TYPE, ANNOUNCE_STATUS } from '../util/constants'
import MainLayout from '../components/layout/MainLayout'
import { Box, dialog } from '../components'
import { Formik, Form, Field } from 'formik'
import { Select, TextField } from '../components/formik'
import Ratio from 'react-ratio'
import Router from 'next/router'
import ReactSelect from 'react-select/async';
import { components } from 'react-select'
import api from '../services/webservice'
import { formatDateTime, formatDate } from '../util/date-time-utilities'

const count = 5

export class WarRoom extends Component {

    static async getInitialProps(ctx) {
        try {
            const res = await Promise.all([
                api.getMainScreen(ctx),
                api.getAllCampaign(ctx),
                api.getPublishedCampaign(ctx),
                api.getAnnouncements({ count, keyword: '', page: 1 }, ctx)
            ])
            const { type } = res[0].data.result
            const allCampaigns = res[1].data.result
            const publishedCampaigns = res[2].data.result
            const { announcementList } = res[3].data.result

            return {
                type,
                allCampaigns,
                publishedCampaigns,
                announcementList
            }
        } catch (error) {
            return {
                error,
                type: '',
                allCampaigns: [],
                publishedCampaigns: [],
                announcementList: []
            }
        }
    }

    constructor(props) {
        super(props)
        const { type, allCampaigns, publishedCampaigns, announcementList } = props
        this.state = {
            type,
            allCampaigns,
            publishedCampaigns,
            announcementList
        }
    }

    onPublishMainScreen(values) {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to publish main screen type?',
            onConfirm: () => api.editMainScreen(values).then(() => {
                setTimeout(() => {
                    dialog.showDialogSuccess({
                        showConfirmButton: false,
                        message: 'Published successfully'
                    })
                }, 250)
            })
        })
    }

    onEditCampaign = (campaignID) => () => {
        Router.push('/campaign/[campaignId]', '/campaign/' + campaignID)
    }

    onDeleteCampaign = (campaignID) => () => {
        this.setState({
            publishedCampaigns: [...this.state.publishedCampaigns.filter(cam => cam.campaignID !== campaignID)]
        }, () => {
            this.loadAllCampaigns
        })
        dialog.showDialogInfo({
            message:'Please click publish button to unpublish deleted campaign.'
        })
    }

    onPublishCampaign = () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to publish these campaigns?',
            onConfirm: () => {
                return api.publishCampaigns({ campaignID: this.state.publishedCampaigns.map(cam => cam.campaignID) }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            message: 'Published successfully',
                            onClose: this.loadAllCampaigns
                        })
                    }, 250);
                })
            }
        })
    }

    onSelectCampaign = (selected) => {
        if (selected) {
            const founded = this.state.allCampaigns.find(cam => {
                return cam.campaignID === selected.value
            })
            if (founded) {
                this.setState({ publishedCampaigns: [founded, ...this.state.publishedCampaigns] }, () => {
                    console.log('added');
                })
            }
        }
    }

    onSearchAnnouncement = (keyword) => {
        api.getAnnouncements({
            keyword, page: 1, count
        }).then(res => {
            const { announcementList } = res.data.result
            this.setState({ announcementList })
        })
    }

    onEditAnnounce = (announcementID) => () => {
        Router.push('/announcement/[id]', '/announcement/' + announcementID)
    }

    onDeleteAnnounce = (announcementID) => () => {
        dialog.showDialogConfirm({
            message: 'Are you sure you want to delete this announcement?',
            onConfirm: () => {
                return api.deleteAnnouncement({ announcementID }).then(() => {
                    setTimeout(() => {
                        dialog.showDialogSuccess({
                            showConfirmButton: false,
                            onClose: () => this.onSearchAnnouncement(this.annFormik.values.keyword),
                            message: 'Deleted successfully'
                        })
                    }, 250)
                })
            }
        })
    }

    loadAllCampaigns = () => {
        return api.getAllCampaign().then(res => {
            this.setState({ allCampaigns: res.data.result })
        })
    }

    render() {

        const { type, publishedCampaigns, announcementList, allCampaigns } = this.state
        const selectedCampaigns = publishedCampaigns.map(cam => cam.campaignID)

        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">War Room</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <div className="row">
                                <div className="col-md-10">
                                    <h4 className="text-dark font-weight-bold">MANAGE MAIN SCREEN</h4>
                                </div>
                                <div className="col-md-2">
                                    <i onClick={() => Router.push('/fair-information')} className="fas fa-edit text-dark float-right" style={{ fontSize: 18, cursor: 'pointer' }} />
                                </div>

                                <Formik
                                    initialValues={{
                                        type: type || ''
                                    }}
                                    validate={values => {
                                        const requires = ['type']
                                        let errors = {}
                                        requires.forEach(field => {
                                            if (!values[field]) {
                                                errors[field] = 'Required';
                                            }
                                        })
                                        return errors;
                                    }}
                                    onSubmit={values => {
                                        this.onPublishMainScreen(values)
                                    }}
                                >
                                    {formik => {
                                        return (
                                            <Form className="col-md-12">
                                                <div className="row">
                                                    <div className="form-group col-lg-12">
                                                        <Field
                                                            name='type'
                                                            label={'Select Main Screen Type'}
                                                            component={Select}
                                                            options={MAIN_SCREEN_TYPE.map(TYPE => ({ name: TYPE, id: TYPE }))}
                                                            isMultiLang={false}
                                                            labelFieldName='name'
                                                            idFieldName='id' />
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <button type="submit" className="btn btn-sm btn-danger float-right">Publish</button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </Box>
                    </div>

                    <div className="col-md-12">
                        <Box>
                            <div className="row">
                                <div className="col-md-10">
                                    <h4 className="text-dark font-weight-bold">EVENT ANNOUNCEMENT</h4>
                                </div>
                                <div className="col-md-2">
                                    <i onClick={() => Router.push('/announcement')} className="fas fa-edit text-dark float-right" style={{ fontSize: 18, cursor: 'pointer' }} />
                                </div>

                                <Formik
                                    initialValues={{
                                        keyword: ''
                                    }}
                                    validateOnBlur={false}
                                    validate={values => {
                                        this.onSearchAnnouncement(values.keyword)
                                        return {}
                                    }}
                                >
                                    {formik => {
                                        this.annFormik = formik
                                        return (
                                            <Form className="col-md-12">
                                                <div className="row">
                                                    <div className="form-group col-lg-12">
                                                        <Field name='keyword' label={'Search Announcement'} component={TextField} onChange={this.onSearchAnnouncement} autoComplete="off" />
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <ul className="list-group list-group-flush">
                                                            {announcementList.map(an => {
                                                                const { announcementID, name, status, sendDate } = an
                                                                return (
                                                                    <li className="list-group-item p-1 d-flex align-items-center justify-content-between" key={announcementID}>
                                                                        <div>
                                                                            <div className="text-dark font-weight-bold">{name}</div>
                                                                            <div className="small">
                                                                                {status === ANNOUNCE_STATUS.SEND ? (
                                                                                    <span className="text-success">Sent ({formatDateTime(sendDate)})</span>
                                                                                ) : (
                                                                                        <span>Draft</span>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <button onClick={this.onEditAnnounce(announcementID)} type="button" className="btn btn-sm btn-outline-danger mr-1"><i className="fas fa-pen" /></button>
                                                                            <button onClick={this.onDeleteAnnounce(announcementID)} type="button" className="btn btn-sm btn-outline-danger"><i className="fas fa-trash" /></button>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>

                                                    </div>
                                                </div>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </Box>
                    </div>

                    <div className="col-md-12">
                        <Box>
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="text-dark font-weight-bold">MANAGE CAMPAIGN</h4>
                                </div>
                                <div className="col-md-6 d-flex align-items-baseline justify-content-end">
                                    <i onClick={() => Router.push('/campaign').then(() => window.scrollTo(0, 0))} className="fas fa-edit text-dark" style={{ fontSize: 18, cursor: 'pointer' }} />
                                </div>

                                <Formik
                                    initialValues={{
                                        select: null
                                    }}
                                >
                                    {formik => {
                                        return (
                                            <Form className="col-md-12">
                                                <div className="row">
                                                    <div className="form-group col-lg-12">
                                                        <Field
                                                            name='select'
                                                            label={'Select Campaign'}
                                                            component={CampaignSelector}
                                                            fetchCallback={api.getAllCampaign}
                                                            selectedID={selectedCampaigns}
                                                            defaultOptions={allCampaigns}
                                                            onChange={this.onSelectCampaign} />
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <ul className="list-group list-group-flush">
                                                            {publishedCampaigns.map(cam => {
                                                                return (
                                                                    <li className="list-group-item px-1 d-flex justify-content-between align-items-center" key={cam.campaignID}>
                                                                        <div className="d-flex">
                                                                            <Ratio ratio={2 / 1.5} className="container-img-crop mr-3" style={{ width: '150px' }}>
                                                                                <div className="container-item-campaign" style={{ backgroundImage: `url("${cam.coverImage}")` }} />
                                                                                <img
                                                                                    width="100%" height="100%" style={{ objectFit: 'contain', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}
                                                                                    src={cam.coverImage || '../../static/img/noimage.jpg'}
                                                                                    alt={cam.name}
                                                                                    className="rounded"
                                                                                    title={cam.name}
                                                                                />
                                                                            </Ratio>
                                                                            <div className="align-self-center">
                                                                                <div className="text-dark font-weight-bold text-left">{cam.name}</div>
                                                                                <div className="text-dark text-left">{formatDate(cam.startDate)} - {formatDate(cam.endDate)}</div>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ width: '72px', minWidth: '72px' }}>
                                                                            <button type="button" className="btn btn-sm btn-outline-danger mr-1" onClick={this.onEditCampaign(cam.campaignID)}><i className="fas fa-pen" /></button>
                                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={this.onDeleteCampaign(cam.campaignID)}><i className="fas fa-trash" /></button>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>

                                                    </div>
                                                </div>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                                <div className="col-lg-12">
                                    <button onClick={this.onPublishCampaign} type="button" className="btn btn-sm btn-danger mr-2 float-right">Publish</button>
                                </div>
                            </div>
                        </Box>
                    </div>

                </div>

            </MainLayout >
        )
    }
}

const CustomCampaignOption = (props) => {
    const { isDisabled, data: { label, image } } = props
    return !isDisabled ? (
        <components.Option {...props}>
            <div className="d-flex justify-content-start align-items-center">
                <Ratio ratio={2 / 1.5} className="container-img-crop mr-3" style={{ width: '50px' }}>
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


class CampaignSelector extends Component {

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
        const { fetchCallback, selectedID = [] } = this.props
        return new Promise(resolve => {
            fetchCallback().then(res => {
                resolve(this.mapOptions(res.data.result.filter(item => {
                    return item.name.toLowerCase().includes(inputValue.toLowerCase()) && !selectedID.includes(item.campaignID)
                })))
            })
        });
    }

    mapOptions = options => {
        return options.map(op => {
            return {
                value: op['campaignID'],
                label: op['name'],
                image: op['coverImage']
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

        const { field, form: { touched, errors, values, setFieldValue, setFieldTouched }, className = "form-control", required, onChange = () => { }, defaultOptions = [], disabled, selectedID = [] } = this.props
        const isError = Boolean((errors[field.name] && touched[field.name]))

        const mappedDefaultOptions = this.mapOptions(defaultOptions.filter(item => {
            return !selectedID.includes(item.campaignID)
        }))

        return (
            <Fragment>
                {this.props.label ? <label>{this.props.label} {required && <span className="text-danger">*</span>}</label> : ''}
                <ReactSelect
                    placeholder="Search by campaign name"
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
                    defaultOptions={mappedDefaultOptions}
                    onBlur={() => setFieldTouched(field.name)}
                    components={{ Option: CustomCampaignOption }}
                    onChange={selected => {
                        onChange(selected)
                    }}
                />
                {isError && <div className="text-danger">{errors[field.name]}</div>}
            </Fragment>
        );
    }
}


export default withAuth(WarRoom, [ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.SUPER_ADMIN])
