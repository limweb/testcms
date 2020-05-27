const getCampaign = {
    params: {
        count: 5,
        page: 1,
        keyword: "string"
    },
    result: {
        total: 10,
        campaignList: [
            {
                name: 'string',
                startDate: 'dd/mm/yyyy',
                endDate: 'dd/mm/yyyy',
                status: 'publish',
                image: 'string url'
            }
        ]
    }
}

const createCampaign = {
    params: {
        name: 'string'
    },
    result: {
        status: 'success'
    }
}


const deleteCampaign = {
    params: {
        campaignID: 'string'
    },
    result: {
        status: 'success'
    }
}

const editCampaign = {
    params: {
        campaignID: 'string',
        name: 'string',
        startDate: 'dd/mm/yyyy',
        endDate: 'dd/mm/yyyy',
        coverImage:{
            fileName:'string',
            filePath:'string',
            fileUrl:'string'
        },
        exhibitors:['id1', 'id2'],
        about:"string"
    },
    result: {
        status: 'success'
    }
}