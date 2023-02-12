const Invoice = require('./../model/invoice');
const Guest = require('./../model/guest');

Invoice.belongsTo(Guest, { foreignKey: { name: 'guestId', allowNull: false } });
