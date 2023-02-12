const RoomServiceOrder = require('./../model/roomServiceOrder');
const Reservation = require('./../model/reservation');
const RoomService = require('./../model/roomService');
const RoomServiceStatus = require('./../model/roomServiceStatus');

RoomServiceOrder.belongsTo(Reservation, { foreignKey: { name: 'reservationId', allowNull: false } });
RoomServiceOrder.belongsTo(RoomService, { foreignKey: { name: 'roomServiceId', allowNull: false } });
RoomServiceOrder.belongsTo(RoomServiceStatus, { foreignKey: { name: 'roomServiceStatusId', allowNull: false } });