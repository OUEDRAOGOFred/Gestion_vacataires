const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'applications',
      key: 'id'
    }
  },
  contractNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalHours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'active', 'completed', 'cancelled'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'contracts',
  timestamps: true
});

module.exports = Contract;