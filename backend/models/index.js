const sequelize = require('../config/database');
const User = require('./User');
const Vacataire = require('./Vacataire');
const Course = require('./Course');
const Application = require('./Application');
const Contract = require('./Contract');
const Payment = require('./Payment');

// Définir les associations
User.hasOne(Vacataire, { foreignKey: 'userId', as: 'vacataire' });
Vacataire.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Vacataire.hasMany(Application, { foreignKey: 'vacataireId', as: 'applications' });
Application.belongsTo(Vacataire, { foreignKey: 'vacataireId', as: 'vacataire' });

Course.hasMany(Application, { foreignKey: 'courseId', as: 'applications' });
Application.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Application.hasOne(Contract, { foreignKey: 'applicationId', as: 'contract' });
Contract.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

Contract.hasMany(Payment, { foreignKey: 'contractId', as: 'payments' });
Payment.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

// Synchroniser la base de données
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // force: true pour recréer les tables
    console.log('Base de données synchronisée avec succès');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Vacataire,
  Course,
  Application,
  Contract,
  Payment,
  syncDatabase
};