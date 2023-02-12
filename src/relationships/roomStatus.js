const RoomStatus = require('./../model/roomStatus');
const Room = require('./../model/room');
const RoomHistory = require('./../model/roomHistory');

RoomStatus.hasMany(Room, { foreignKey: { name: 'roomStatusId', allowNull: false } });
RoomStatus.hasMany(RoomHistory, { foreignKey: { name: 'roomStatusId', allowNull: false } });