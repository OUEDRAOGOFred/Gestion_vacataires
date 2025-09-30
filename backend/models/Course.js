const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  hoursPerWeek: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  totalHours: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  semester: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true
});

module.exports = Course;