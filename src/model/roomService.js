const Sequelize = require('sequelize');
const database = require('./../db');

const RoomService = database.define('roomService', {
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
    },
    price: {
        type: Sequelize.NUMBER,
        allowNull: false
    }
});

module.exports = RoomService;