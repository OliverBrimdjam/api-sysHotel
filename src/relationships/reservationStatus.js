const ReservationStatus = require('./../model/reservationStatus');
const Reservation = require('./../model/reservation');

ReservationStatus.hasMany(Reservation, { foreignKey: { name: 'reservationStatusId', allowNull: false } });