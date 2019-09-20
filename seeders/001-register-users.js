"use strict";
const ApiTest = require("../libs/api-test");

const users = [
    {
        firstname: "Admin",
        lastname: "Admin",
        email: "admin@admin.fr",
        password: "aaa",
        type: "Admin"
    },
    {
        firstname: "Victor",
        lastname: "Hugo",
        email: "victor.hugo@test.fr",
        password: "aaa",
        type: "User"
    }
];


exports.up = function() {
    return Promise.all(
        users.map((user) => register(user))
    );
};


function register(user) {
    let id = null;
    let api = new ApiTest();

    return Promise.resolve()
    .then(register)
    .then(authenticateUser);

    function register() {
        return api.post('/user/auth/register', {
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
            email: user.email,
            type: user.type
        })
        .then((res) => {
            api.setToken(res.token);
            id = res.id;
        });
    }

    function authenticateUser() {
        return api.post('/user/auth/login', {
            email: 'victor.hugo@test.fr',
            password: 'aaa'
        })
        .then((res) => api.setToken(res.token));
    }
}


