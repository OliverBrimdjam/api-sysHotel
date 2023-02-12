const RoomService = require('./../model/roomService');
const RoomServiceOrder = require('./../model/roomServiceOrder');

RoomService.hasMany(RoomServiceOrder, { foreignKey: { name: 'roomServiceId', allowNull: false } });