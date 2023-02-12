const Room = require('./../model/room');
const RoomType = require('./../model/roomType');
const RoomStatus = require('./../model/roomStatus');
const Reservation = require('./../model/reservation');
const RoomHistory = require('./../model/roomHistory');

Room.belongsTo(RoomType, { foreignKey: { name: 'roomTypeId', allowNull: false } });
Room.belongsTo(RoomStatus, { foreignKey: { name: 'roomStatusId', allowNull: false } });

Room.hasMany(Reservation, { foreignKey: { name: 'roomId', allowNull: false } });
Room.hasMany(RoomHistory, { foreignKey: { name: 'roomId', allowNull: false } });