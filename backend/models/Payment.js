const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contractId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contracts',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  paidDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'payments',
  timestamps: true
});

module.exports = Payment;