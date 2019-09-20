'use strict';

const debug = require("debug")("app:models:sequelize");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config");


const models = {};
let sequelize = null;
initSequelize();
loadModels();
associateModels();

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.Op = Sequelize.Op;
module.exports = models;


function initSequelize() {
    const cls = require("continuation-local-storage");
    const namespace = cls.createNamespace("cau-sports-news");
    Sequelize.useCLS(namespace);
    sequelize = new Sequelize(
        config.development.database,
        config.development.username,
        config.development.password,
        {
            dialect: config.development.dialect,
            define: {underscored: true, timestamps: false},
            logging: config.development.logging,
            host: config.development.host,
            maxConcurrentQueries: config.development.connectionLimit
        }
    );
}

function loadModels() {
    models.User= sequelize["import"](path.join(__dirname, "./user"));
    models.Comment= sequelize["import"](path.join(__dirname, "./comment"));
    models.Article= sequelize["import"](path.join(__dirname, "./article"));
    models.Favorite= sequelize["import"](path.join(__dirname, "./favorite"));
    models.Result= sequelize["import"](path.join(__dirname, "./result"));
}

function associateModels() {
    Object.keys(models).forEach(function(modelName) {
        if(models[modelName].associate) {
            models[modelName].associate(models);
        }
    });
}