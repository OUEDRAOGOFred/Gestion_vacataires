const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'rh', 'vacataire'),
    defaultValue: 'vacataire'
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  charterAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  charterAcceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await require('bcryptjs').hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await require('bcryptjs').hash(user.password, 10);
      }
    }
  }
});

// Méthode pour vérifier le mot de passe
User.prototype.comparePassword = async function(candidatePassword) {
  return require('bcryptjs').compare(candidatePassword, this.password);
};

module.exports = User;