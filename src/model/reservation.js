const Sequelize = require('sequelize');
const database = require('./../db');

const Reservation = database.define('reservation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    reserveStart: {
        type: Sequelize.DATE,
        allowNull: false
    },
    days: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    checkIn: {
        type: Sequelize.DATE,
        allowNull: true
    },
    checkOut: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

module.exports = Reservation;