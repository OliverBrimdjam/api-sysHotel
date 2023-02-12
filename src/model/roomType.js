const Sequelize = require('sequelize');
const database = require('./../db');

const RoomType = database.define('roomType', {
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

module.exports = RoomType;