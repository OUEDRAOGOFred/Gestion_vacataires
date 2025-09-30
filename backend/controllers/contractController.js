const { Contract, Application, Course, Vacataire, User, Payment } = require('../models');

// Obtenir tous les contrats
const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [{
        model: Application,
        as: 'application',
        include: [
          {
            model: Course,
            as: 'course'
          },
          {
            model: Vacataire,
            as: 'vacataire',
            include: [{
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }]
          }
        ]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(contracts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contrats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats' });
  }
};

// Obtenir un contrat par ID
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByPk(id, {
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            {
              model: Course,
              as: 'course'
            },
            {
              model: Vacataire,
              as: 'vacataire',
              include: [{
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'phone']
              }]
            }
          ]
        },
        {
          model: Payment,
          as: 'payments'
        }
      ]
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    res.json(contract);
  } catch (error) {
    console.error('Erreur lors de la récupération du contrat:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du contrat' });
  }
};

// Mettre à jour un contrat
const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { hourlyRate, totalHours, startDate, endDate, status } = req.body;

    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const updateData = {};
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (totalHours !== undefined) updateData.totalHours = totalHours;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (status !== undefined) updateData.status = status;

    // Recalculer le montant total si nécessaire
    if (hourlyRate !== undefined || totalHours !== undefined) {
      const newHourlyRate = hourlyRate !== undefined ? hourlyRate : contract.hourlyRate;
      const newTotalHours = totalHours !== undefined ? totalHours : contract.totalHours;
      updateData.totalAmount = newHourlyRate * newTotalHours;
    }

    await contract.update(updateData);

    const updatedContract = await Contract.findByPk(id, {
      include: [{
        model: Application,
        as: 'application',
        include: [
          {
            model: Course,
            as: 'course'
          },
          {
            model: Vacataire,
            as: 'vacataire',
            include: [{
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }]
          }
        ]
      }]
    });

    res.json({
      message: 'Contrat mis à jour avec succès',
      contract: updatedContract
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contrat:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du contrat' });
  }
};

// Créer un paiement pour un contrat
const createPayment = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { amount, dueDate } = req.body;

    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    const payment = await Payment.create({
      contractId: parseInt(contractId),
      amount,
      dueDate,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Paiement créé avec succès',
      payment
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la création du paiement' });
  }
};

// Marquer un paiement comme payé
const markPaymentAsPaid = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paidDate } = req.body;

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    await payment.update({
      status: 'paid',
      paidDate: paidDate || new Date()
    });

    res.json({
      message: 'Paiement marqué comme payé',
      payment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du paiement' });
  }
};

// Obtenir les contrats d'un vacataire
const getVacataireContracts = async (req, res) => {
  try {
    const userId = req.user.id;
    const vacataire = await Vacataire.findOne({ where: { userId } });
    
    if (!vacataire) {
      return res.status(404).json({ message: 'Profil vacataire non trouvé' });
    }

    const applications = await Application.findAll({
      where: { vacataireId: vacataire.id },
      include: [{
        model: Contract,
        as: 'contract',
        include: [{
          model: Payment,
          as: 'payments'
        }]
      }, {
        model: Course,
        as: 'course'
      }]
    });

    const contracts = applications
      .filter(app => app.contract)
      .map(app => ({
        ...app.contract.toJSON(),
        course: app.course,
        application: {
          id: app.id,
          status: app.status
        }
      }));

    res.json(contracts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contrats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats' });
  }
};

// Obtenir les statistiques des contrats
const getContractStats = async (req, res) => {
  try {
    const totalContracts = await Contract.count();
    const draftContracts = await Contract.count({ where: { status: 'draft' } });
    const activeContracts = await Contract.count({ where: { status: 'active' } });
    const completedContracts = await Contract.count({ where: { status: 'completed' } });

    const totalPayments = await Payment.count();
    const pendingPayments = await Payment.count({ where: { status: 'pending' } });
    const paidPayments = await Payment.count({ where: { status: 'paid' } });

    res.json({
      contracts: {
        total: totalContracts,
        draft: draftContracts,
        active: activeContracts,
        completed: completedContracts
      },
      payments: {
        total: totalPayments,
        pending: pendingPayments,
        paid: paidPayments
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

// Supprimer un contrat
const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    // Supprimer d'abord les paiements associés
    await Payment.destroy({ where: { contractId: id } });
    
    // Puis supprimer le contrat
    await contract.destroy();

    res.json({ message: 'Contrat supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du contrat:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du contrat' });
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  createPayment,
  markPaymentAsPaid,
  getVacataireContracts,
  getContractStats
};