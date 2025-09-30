const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vacataire = sequelize.define('Vacataire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  specialization: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  cvFile: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  diplomaFile: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'vacataires',
  timestamps: true
});

module.exports = Vacataire;