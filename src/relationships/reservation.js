const Reservation = require('./../model/reservation');
const Room = require('./../model/room');
const Guest = require('./../model/guest');
const ReservationStatus = require('./../model/reservationStatus');
const RoomServiceOrder = require('./../model/roomServiceOrder');

Reservation.belongsTo(Room, { foreignKey: { name: 'roomId', allowNull: false } });
Reservation.belongsTo(Guest, { foreignKey: { name: 'guestId', allowNull: false } });
Reservation.belongsTo(Guest, { foreignKey: { name: 'companionId', allowNull: true } });
Reservation.belongsTo(ReservationStatus, { foreignKey: { name: 'reservationStatusId', allowNull: false } });

Reservation.hasMany(RoomServiceOrder, { foreignKey: { name: 'reservationId', allowNull: false } });