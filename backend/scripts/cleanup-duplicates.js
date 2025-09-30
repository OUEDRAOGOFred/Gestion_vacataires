const { Course } = require('../models');

async function cleanupDuplicateCourses() {
  console.log('🧹 Nettoyage des cours en doublon...\n');

  try {
    // Trouver tous les cours groupés par code
    const courses = await Course.findAll({
      order: [['code', 'ASC'], ['createdAt', 'ASC']]
    });

    const codeGroups = {};
    courses.forEach(course => {
      if (!codeGroups[course.code]) {
        codeGroups[course.code] = [];
      }
      codeGroups[course.code].push(course);
    });

    // Identifier les doublons
    const duplicates = Object.entries(codeGroups).filter(([code, courseList]) => courseList.length > 1);
    
    if (duplicates.length === 0) {
      console.log('✅ Aucun doublon trouvé');
      return;
    }

    console.log(`📊 ${duplicates.length} codes de cours en doublon trouvés:`);
    
    for (const [code, courseList] of duplicates) {
      console.log(`\n🔍 Code: ${code} (${courseList.length} occurrences)`);
      
      // Garder le premier cours (le plus ancien)
      const keepCourse = courseList[0];
      const deleteCourses = courseList.slice(1);
      
      console.log(`   ✅ Garder: ID ${keepCourse.id} - "${keepCourse.name}" (${keepCourse.createdAt})`);
      
      for (const course of deleteCourses) {
        console.log(`   ❌ Supprimer: ID ${course.id} - "${course.name}" (${course.createdAt})`);
        await course.destroy();
      }
    }

    console.log('\n🎉 Nettoyage terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage
cleanupDuplicateCourses()
  .then(() => {
    console.log('\n✅ Script terminé');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });



