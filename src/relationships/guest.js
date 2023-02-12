const Guest = require('./../model/guest');
const Invoice = require('./../model/invoice');
const Reservation = require('./../model/reservation');

Guest.hasMany(Invoice, { foreignKey: { name: 'guestId', allowNull: false } });
Guest.hasMany(Reservation, { foreignKey: { name: 'guestId', allowNull: false } });
Guest.hasMany(Reservation, { foreignKey: { name: 'companionId', allowNull: true } });