const Room = require('./../model/room');
const RoomStatus = require('./../model/roomStatus');
const RoomHistory = require('./../model/roomHistory');

RoomHistory.belongsTo(Room, { foreignKey: { name: 'roomId', allowNull: false } });
RoomHistory.belongsTo(RoomStatus, { foreignKey: { name: 'roomStatusId', allowNull: false } });
