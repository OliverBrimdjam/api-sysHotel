const Sequelize = require('sequelize');
const database = require('./../db');

const RoomServiceStatus = database.define('roomServiceStatus', {
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

module.exports = RoomServiceStatus;