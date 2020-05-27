import React, { Component } from 'react'
import ExhibitorNav from '../../../components/layout/exhibitor-nav'
import MainLayout from '../../../components/layout/MainLayout'
import Router from 'next/router'
import { Box } from '../../../components'
import { withAuth } from '../../../services/auth'
import { ROLES } from '../../../util/constants'
import { getExhibitorID } from '..'

export class LiveContact extends Component {

    static async getInitialProps(ctx) {

        const exhibitId = getExhibitorID(ctx)

        return {
            exhibitId
        }
    }

    render() {
        return (
            <MainLayout {...this.props}>

                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Exhibitor Detail</h1>
                </div>

                <div className="row">

                    <div className="col-md-12">
                        <Box>
                            <ExhibitorNav currentTab="live-contact" exhibitorId={this.props.exhibitId}/>
                            <div className="col-md-12 p-3">


                            </div>
                        </Box>
                    </div>

                </div>

            </MainLayout>
        )
    }
}

export default withAuth(LiveContact, [ROLES.SUPER_ADMIN, ROLES.ORGANIZER, ROLES.ORGANIZER_STAFF, ROLES.EXHIBITOR])
