const Sequelize = require('sequelize');
const database = require('./../db');

const ReservationStatus = database.define('reservationStatus', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = ReservationStatus;