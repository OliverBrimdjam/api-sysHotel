const Sequelize = require('sequelize');
const database = require('./../db');

const RoomServiceOrder = database.define('roomServiceOrder', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = RoomServiceOrder;