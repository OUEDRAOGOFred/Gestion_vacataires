const { Application, Course, Vacataire, User, Contract } = require('../models');
const { sendEmail } = require('../utils/emailService');

// Obtenir tous les cours disponibles
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['name', 'ASC']]
    });
    res.json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
  }
};

// Créer un nouveau cours (admin/RH)
const createCourse = async (req, res) => {
  try {
    const { code, name, hoursPerWeek, totalHours, semester, department } = req.body;

    // Validation des données requises
    if (!code || !name || !hoursPerWeek || !totalHours || !semester || !department) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis',
        required: ['code', 'name', 'hoursPerWeek', 'totalHours', 'semester', 'department']
      });
    }

    // Vérifier si le code existe déjà
    const existingCourse = await Course.findOne({ where: { code } });
    if (existingCourse) {
      return res.status(400).json({ 
        message: `Le code de cours '${code}' existe déjà`,
        existingCourse: {
          id: existingCourse.id,
          code: existingCourse.code,
          name: existingCourse.name
        }
      });
    }

    // Créer le cours
    const course = await Course.create({
      code: code.trim().toUpperCase(), // Normaliser le code
      name: name.trim(),
      hoursPerWeek: parseInt(hoursPerWeek),
      totalHours: parseInt(totalHours),
      semester: semester.trim(),
      department: department.trim()
    });

    res.status(201).json({
      message: 'Cours créé avec succès',
      course
    });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    
    // Gestion spécifique des erreurs Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path || 'champ';
      return res.status(400).json({ 
        message: `Ce ${field} existe déjà`,
        field: field,
        value: error.errors[0]?.value
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({ 
        message: 'Erreurs de validation',
        errors: validationErrors
      });
    }

    res.status(500).json({ 
      message: 'Erreur lors de la création du cours',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
  }
};

// Soumettre une candidature
const submitApplication = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur est un vacataire approuvé
    const vacataire = await Vacataire.findOne({ 
      where: { userId },
      include: [{ model: User, as: 'user' }]
    });

    if (!vacataire) {
      return res.status(404).json({ message: 'Profil vacataire non trouvé' });
    }

    if (vacataire.status !== 'approved') {
      return res.status(403).json({ message: 'Votre profil vacataire doit être approuvé pour postuler' });
    }

    // Vérifier que l'utilisateur a accepté la charte
    const user = await User.findByPk(userId);
    if (!user.charterAccepted) {
      return res.status(403).json({ 
        message: 'Vous devez accepter la charte d\'engagement avant de pouvoir postuler',
        charterRequired: true
      });
    }

    // Vérifier que le cours existe
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier qu'il n'y a pas déjà une candidature pour ce cours
    const existingApplication = await Application.findOne({
      where: {
        vacataireId: vacataire.id,
        courseId: courseId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Vous avez déjà postulé pour ce cours' });
    }

    // Créer la candidature
    const application = await Application.create({
      vacataireId: vacataire.id,
      courseId: courseId,
      status: 'submitted'
    });

    // Inclure les informations du cours et du vacataire
    const applicationWithDetails = await Application.findByPk(application.id, {
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
    });

    // Envoyer l'email de confirmation
    try {
      await sendEmail(user.email, 'applicationSubmitted', {
        firstName: user.firstName,
        lastName: user.lastName,
        discipline: course.name,
        submittedAt: new Date()
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // On continue même si l'email échoue
    }

    res.status(201).json({
      message: 'Candidature soumise avec succès',
      application: applicationWithDetails
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de la candidature:', error);
    res.status(500).json({ message: 'Erreur lors de la soumission de la candidature' });
  }
};

// Obtenir toutes les candidatures (admin/RH)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
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
      ],
      order: [['submittedAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures' });
  }
};

// Mettre à jour le statut d'une candidature (admin/RH)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    if (status === 'reviewed' || status === 'approved' || status === 'rejected') {
      updateData.reviewedAt = new Date();
    }

    await application.update(updateData);

    // Si la candidature est approuvée, créer un contrat
    if (status === 'approved') {
      const course = await Course.findByPk(application.courseId);
      const contractNumber = `CONTRACT-${Date.now()}-${application.id}`;
      
      await Contract.create({
        applicationId: application.id,
        contractNumber,
        hourlyRate: 5000, // Taux horaire par défaut
        totalHours: course.totalHours || 0,
        totalAmount: (course.totalHours || 0) * 5000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        status: 'draft'
      });
    }

    const updatedApplication = await Application.findByPk(id, {
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
    });

    // Envoyer l'email de mise à jour du statut
    try {
      const userEmail = updatedApplication.vacataire.user.email;
      await sendEmail(userEmail, 'applicationStatusUpdate', {
        firstName: updatedApplication.vacataire.user.firstName,
        lastName: updatedApplication.vacataire.user.lastName,
        status: status,
        feedback: notes
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de mise à jour:', emailError);
      // On continue même si l'email échoue
    }

    res.json({
      message: 'Statut de la candidature mis à jour avec succès',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};

// Mettre à jour un cours (admin/RH)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, hoursPerWeek, totalHours, semester, department } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Si le code change, vérifier qu'il n'existe pas déjà
    if (code && code !== course.code) {
      const existingCourse = await Course.findOne({ 
        where: { 
          code: code.trim().toUpperCase(),
          id: { [require('sequelize').Op.ne]: id }
        } 
      });
      if (existingCourse) {
        return res.status(400).json({ 
          message: `Le code de cours '${code}' existe déjà`,
          existingCourse: {
            id: existingCourse.id,
            code: existingCourse.code,
            name: existingCourse.name
          }
        });
      }
    }

    // Mettre à jour le cours
    const updateData = {};
    if (code) updateData.code = code.trim().toUpperCase();
    if (name) updateData.name = name.trim();
    if (hoursPerWeek) updateData.hoursPerWeek = parseInt(hoursPerWeek);
    if (totalHours) updateData.totalHours = parseInt(totalHours);
    if (semester) updateData.semester = semester.trim();
    if (department) updateData.department = department.trim();

    await course.update(updateData);

    res.json({
      message: 'Cours mis à jour avec succès',
      course
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path || 'champ';
      return res.status(400).json({ 
        message: `Ce ${field} existe déjà`,
        field: field,
        value: error.errors[0]?.value
      });
    }

    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du cours',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
  }
};

// Supprimer un cours (admin/RH)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier s'il y a des candidatures pour ce cours
    const applicationsCount = await Application.count({ where: { courseId: id } });
    if (applicationsCount > 0) {
      return res.status(400).json({ 
        message: `Impossible de supprimer ce cours car ${applicationsCount} candidature(s) y sont associées`,
        applicationsCount
      });
    }

    await course.destroy();

    res.json({
      message: 'Cours supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du cours',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
  }
};

// Obtenir les statistiques des candidatures
const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await Application.count();
    const submittedApplications = await Application.count({ where: { status: 'submitted' } });
    const reviewedApplications = await Application.count({ where: { status: 'reviewed' } });
    const approvedApplications = await Application.count({ where: { status: 'approved' } });
    const rejectedApplications = await Application.count({ where: { status: 'rejected' } });

    res.json({
      total: totalApplications,
      submitted: submittedApplications,
      reviewed: reviewedApplications,
      approved: approvedApplications,
      rejected: rejectedApplications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats
};