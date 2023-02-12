const Sequelize = require('sequelize');
const database = require('./../db');

const Guest = database.define('guest', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    documentType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    documentCode: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Guest;