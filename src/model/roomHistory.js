const Sequelize = require('sequelize');
const database = require('./../db');

const RoomHistory = database.define('roomHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    lastChange: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = RoomHistory;