const Sequelize = require('sequelize');
const database = require('./../db');

const Invoice = database.define('invoice', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paidValue: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    bill: {
        type: Sequelize.NUMBER,
        allowNull: false
    }
});

module.exports = Invoice;