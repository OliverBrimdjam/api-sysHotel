const RoomType = require('./../model/roomType');
const Room = require('./../model/room');

RoomType.hasMany(Room, { foreignKey: { name: 'roomTypeId', allowNull: false } });