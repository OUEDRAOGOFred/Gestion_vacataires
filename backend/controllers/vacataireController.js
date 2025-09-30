const { User, Vacataire, Application, Course } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// Obtenir tous les vacataires (pour admin/RH)
const getAllVacataires = async (req, res) => {
  try {
    const vacataires = await Vacataire.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(vacataires);
  } catch (error) {
    console.error('Erreur lors de la récupération des vacataires:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des vacataires' });
  }
};

// Obtenir un vacataire par ID
const getVacataireById = async (req, res) => {
  try {
    const { id } = req.params;
    const vacataire = await Vacataire.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
      }]
    });

    if (!vacataire) {
      return res.status(404).json({ message: 'Vacataire non trouvé' });
    }

    res.json(vacataire);
  } catch (error) {
    console.error('Erreur lors de la récupération du vacataire:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du vacataire' });
  }
};

// Mettre à jour le profil vacataire
const updateVacataireProfile = async (req, res) => {
  try {
    const { specialization, experienceYears } = req.body;
    const userId = req.user.id;

    // Trouver le vacataire
    const vacataire = await Vacataire.findOne({ where: { userId } });
    if (!vacataire) {
      return res.status(404).json({ message: 'Profil vacataire non trouvé' });
    }

    // Mettre à jour les informations
    await vacataire.update({
      specialization,
      experienceYears
    });

    // Mettre à jour les fichiers si fournis
    if (req.files) {
      const updateData = {};
      if (req.files.cvFile) {
        updateData.cvFile = req.files.cvFile[0].filename;
      }
      if (req.files.diplomaFile) {
        updateData.diplomaFile = req.files.diplomaFile[0].filename;
      }
      
      if (Object.keys(updateData).length > 0) {
        await vacataire.update(updateData);
      }
    }

    const updatedVacataire = await Vacataire.findByPk(vacataire.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
      }]
    });

    res.json({
      message: 'Profil vacataire mis à jour avec succès',
      vacataire: updatedVacataire
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil vacataire:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil vacataire' });
  }
};

// Valider ou rejeter un vacataire (admin/RH)
const updateVacataireStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const vacataire = await Vacataire.findByPk(id);
    if (!vacataire) {
      return res.status(404).json({ message: 'Vacataire non trouvé' });
    }

    await vacataire.update({ status });

    res.json({
      message: `Vacataire ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès`,
      vacataire
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};

// Obtenir les candidatures d'un vacataire
const getVacataireApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const vacataire = await Vacataire.findOne({ where: { userId } });
    
    if (!vacataire) {
      return res.status(404).json({ message: 'Profil vacataire non trouvé' });
    }

    const applications = await Application.findAll({
      where: { vacataireId: vacataire.id },
      include: [{
        model: Course,
        as: 'course'
      }],
      order: [['submittedAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures' });
  }
};

// Obtenir les statistiques des vacataires
const getVacataireStats = async (req, res) => {
  try {
    const totalVacataires = await Vacataire.count();
    const pendingVacataires = await Vacataire.count({ where: { status: 'pending' } });
    const approvedVacataires = await Vacataire.count({ where: { status: 'approved' } });
    const rejectedVacataires = await Vacataire.count({ where: { status: 'rejected' } });

    res.json({
      total: totalVacataires,
      pending: pendingVacataires,
      approved: approvedVacataires,
      rejected: rejectedVacataires
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

module.exports = {
  getAllVacataires,
  getVacataireById,
  updateVacataireProfile,
  updateVacataireStatus,
  getVacataireApplications,
  getVacataireStats,
  // Export du dossier complet d'un vacataire (CV, diplôme, profil)
  async downloadVacataireDossier(req, res) {
    try {
      const { id } = req.params;
      let vacataire = await Vacataire.findOne({
        where: {
          [Op.or]: [
            { id: isNaN(Number(id)) ? id : Number(id) },
            { userId: isNaN(Number(id)) ? id : Number(id) }
          ]
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'createdAt']
        }]
      });

      if (!vacataire) {
        // Aucun enregistrement Vacataire: retourner tout de même un ZIP avec profil utilisateur minimal
        const userFallback = await User.findByPk(isNaN(Number(id)) ? id : Number(id));
        if (!userFallback) {
          return res.status(404).json({ message: `Profil non trouvé pour id/userId=${id}` });
        }

        const zipFilename = `dossier_vacataire_user_${userFallback.id}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', (err) => {
          console.error('Erreur archive:', err);
          res.status(500).end();
        });
        archive.pipe(res);

        const profileJson = {
          vacataireId: null,
          status: null,
          specialization: null,
          experienceYears: null,
          user: {
            id: userFallback.id,
            firstName: userFallback.firstName,
            lastName: userFallback.lastName,
            email: userFallback.email,
            phone: userFallback.phone,
            createdAt: userFallback.createdAt
          },
          exportedAt: new Date().toISOString()
        };
        archive.append(JSON.stringify(profileJson, null, 2), { name: 'profil.json' });
        await archive.finalize();
        return;
      }

      const uploadsDir = path.join(__dirname, '..', 'uploads');
      const filesToInclude = [];

      const cvPath = vacataire.cvFile ? path.join(uploadsDir, vacataire.cvFile) : null;
      const diplomaPath = vacataire.diplomaFile ? path.join(uploadsDir, vacataire.diplomaFile) : null;
      const hasCV = cvPath && fs.existsSync(cvPath);
      const hasDiploma = diplomaPath && fs.existsSync(diplomaPath);

      // N'interrompre plus le flux: inclure les fichiers disponibles et ajouter un avertissement si incomplet
      if (hasCV) {
        const cvExt = path.extname(vacataire.cvFile) || '.pdf';
        filesToInclude.push({ path: cvPath, name: `CV_${vacataire.user?.lastName || 'vacataire'}${cvExt}` });
      }
      if (hasDiploma) {
        const dipExt = path.extname(vacataire.diplomaFile) || '.pdf';
        filesToInclude.push({ path: diplomaPath, name: `Diplome_${vacataire.user?.lastName || 'vacataire'}${dipExt}` });
      }

      // Prépare le flux ZIP
      const zipFilename = `dossier_vacataire_${vacataire.id}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (err) => {
        console.error('Erreur archive:', err);
        res.status(500).end();
      });
      archive.pipe(res);

      // Ajouter un fichier JSON avec les métadonnées du profil
      const profileJson = {
        vacataireId: vacataire.id,
        status: vacataire.status,
        specialization: vacataire.specialization,
        experienceYears: vacataire.experienceYears,
        user: {
          id: vacataire.user?.id,
          firstName: vacataire.user?.firstName,
          lastName: vacataire.user?.lastName,
          email: vacataire.user?.email,
          phone: vacataire.user?.phone,
          createdAt: vacataire.user?.createdAt
        },
        exportedAt: new Date().toISOString()
      };
      archive.append(JSON.stringify(profileJson, null, 2), { name: 'profil.json' });

      if (!hasCV || !hasDiploma) {
        const warning = [
          'AVERTISSEMENT: Dossier incomplet.',
          `CV présent: ${hasCV ? 'oui' : 'non'}`,
          `Diplôme présent: ${hasDiploma ? 'oui' : 'non'}`,
          'Veuillez compléter les documents manquants dans le profil du vacataire.'
        ].join('\n');
        archive.append(warning, { name: 'AVERTISSEMENT.txt' });
      }

      // Ajouter les fichiers présents
      filesToInclude.forEach((file) => {
        archive.file(file.path, { name: file.name });
      });

      await archive.finalize();
    } catch (error) {
      console.error('Erreur lors du téléchargement du dossier vacataire:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erreur lors de la génération du dossier' });
      }
    }
  }
  ,
  // Variante: télécharger le dossier en utilisant l'identifiant utilisateur
  async downloadVacataireDossierByUser(req, res) {
    try {
      const { userId } = req.params;
      const numericUserId = isNaN(Number(userId)) ? userId : Number(userId);
      const vacataire = await Vacataire.findOne({
        where: { userId: numericUserId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'createdAt']
        }]
      });

      if (!vacataire) {
        // Aucun enregistrement Vacataire pour cet utilisateur: générer un ZIP avec profil utilisateur minimal
        const userFallback = await User.findByPk(numericUserId);
        if (!userFallback) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const zipFilename = `dossier_vacataire_user_${userFallback.id}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=\"${zipFilename}\"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', (err) => {
          console.error('Erreur archive:', err);
          res.status(500).end();
        });
        archive.pipe(res);

        const profileJson = {
          vacataireId: null,
          status: null,
          specialization: null,
          experienceYears: null,
          user: {
            id: userFallback.id,
            firstName: userFallback.firstName,
            lastName: userFallback.lastName,
            email: userFallback.email,
            phone: userFallback.phone,
            createdAt: userFallback.createdAt
          },
          exportedAt: new Date().toISOString()
        };
        archive.append(JSON.stringify(profileJson, null, 2), { name: 'profil.json' });
        await archive.finalize();
        return;
      }

      const uploadsDir = path.join(__dirname, '..', 'uploads');
      const filesToInclude = [];

      const cvPath2 = vacataire.cvFile ? path.join(uploadsDir, vacataire.cvFile) : null;
      const diplomaPath2 = vacataire.diplomaFile ? path.join(uploadsDir, vacataire.diplomaFile) : null;
      const hasCV2 = cvPath2 && fs.existsSync(cvPath2);
      const hasDiploma2 = diplomaPath2 && fs.existsSync(diplomaPath2);

      // Inclure les fichiers disponibles et ajouter un avertissement si incomplet
      if (hasCV2) {
        const cvExt2 = path.extname(vacataire.cvFile) || '.pdf';
        filesToInclude.push({ path: cvPath2, name: `CV_${vacataire.user?.lastName || 'vacataire'}${cvExt2}` });
      }
      if (hasDiploma2) {
        const dipExt2 = path.extname(vacataire.diplomaFile) || '.pdf';
        filesToInclude.push({ path: diplomaPath2, name: `Diplome_${vacataire.user?.lastName || 'vacataire'}${dipExt2}` });
      }

      const zipFilename = `dossier_vacataire_${vacataire.id}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (err) => {
        console.error('Erreur archive:', err);
        res.status(500).end();
      });
      archive.pipe(res);

      const profileJson = {
        vacataireId: vacataire.id,
        status: vacataire.status,
        specialization: vacataire.specialization,
        experienceYears: vacataire.experienceYears,
        user: {
          id: vacataire.user?.id,
          firstName: vacataire.user?.firstName,
          lastName: vacataire.user?.lastName,
          email: vacataire.user?.email,
          phone: vacataire.user?.phone,
          createdAt: vacataire.user?.createdAt
        },
        exportedAt: new Date().toISOString()
      };
      archive.append(JSON.stringify(profileJson, null, 2), { name: 'profil.json' });
      if (!hasCV2 || !hasDiploma2) {
        const warning2 = [
          'AVERTISSEMENT: Dossier incomplet.',
          `CV présent: ${hasCV2 ? 'oui' : 'non'}`,
          `Diplôme présent: ${hasDiploma2 ? 'oui' : 'non'}`,
          'Veuillez compléter les documents manquants dans le profil du vacataire.'
        ].join('\n');
        archive.append(warning2, { name: 'AVERTISSEMENT.txt' });
      }
      filesToInclude.forEach((file) => {
        archive.file(file.path, { name: file.name });
      });
      await archive.finalize();
    } catch (error) {
      console.error('Erreur lors du téléchargement du dossier vacataire (par userId):', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erreur lors de la génération du dossier' });
      }
    }
  }
};