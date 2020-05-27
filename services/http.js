import axios from 'axios'
const BASE_URL = process.env.MAIN_API_ENDPOINT

const setHeader = (isMultipart, token) => {

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    axios.defaults.baseURL = BASE_URL

    axios.defaults.maxContentLength = 100000000
    axios.defaults.maxBodyLength = 100000000

    axios.defaults.headers = {
        "Content-Type": isMultipart ? 'multipart/form-data' : "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": token == null ? "" : "bearer " + token,
    };

    axios.defaults.timeout = 60 * 4 * 1000;
}


const post = (path, parameter, token, isMultipart, config = {}) => {


    return new Promise((resolve, reject) => {

        setHeader(isMultipart, token)

        return axios
            .post(path, parameter, config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                reject(error);
            });
    });
}

const get = (path, parameter, token, config = {}) => {


    return new Promise((resolve, reject) => {

        setHeader(false, token)
        return axios
            .get(path, { params: parameter, ...config })
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                reject(error);
            });
    });
}


const put = (path, parameter, token, isMultipart, config = {}) => {


    return new Promise((resolve, reject) => {

        setHeader(isMultipart, token)

        return axios
            .put(path, parameter, config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {

                reject(error);
            });
    })
}

const deletes = (path, parameter, token, isMultipart, config = {}) => {

    return new Promise((resolve, reject) => {

        setHeader(isMultipart, token)

        return axios
            .delete(path, { data: parameter, ...config })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export { post, get, put, deletes, BASE_URL }