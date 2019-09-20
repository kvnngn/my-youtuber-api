const request = require("request-promise-native");
const _ = require("lodash");
const config = require("../config");

class ApiTest {

    constructor() {
        this.defaultOptions = {
            baseUrl: "http://localhost:" + config.port,
            uri: "",
            json: true
        };
    }

    setToken(token) {
        this.token = token;
    }

    getToken(token) {
        return this.token;
    }

    deleteToken() {
        this.token = null;
    }

    get(uri) {
        return this.api({
            uri: uri,
            method: "GET"
        })
    }

    post(uri, body) {
        return this.api({
            uri: uri,
            method: "POST",
            body: body
        })
    }

    put(uri, body) {
        return this.api({
            uri: uri,
            method: "PUT",
            body: body
        })
    }

    delete(uri) {
        return this.api({
            uri: uri,
            method: "DELETE"
        })
    }

    api(newOptions) {
        const options = {};
        if(this.token) { options.headers = {'Authorization': 'JWT ' + this.token}; }
        _.merge(options, this.defaultOptions, newOptions);
        return request(options);
    }
}

module.exports = ApiTest;