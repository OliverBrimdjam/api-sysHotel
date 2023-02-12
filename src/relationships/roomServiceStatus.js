const RoomServiceStatus = require('./../model/roomServiceStatus');
const RoomServiceOrder = require('./../model/roomServiceOrder');

RoomServiceStatus.hasMany(RoomServiceOrder, { foreignKey: { name: 'roomServiceStatusId', allowNull: false } });