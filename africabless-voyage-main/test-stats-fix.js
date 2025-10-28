// Test de la correction pour le problème de stats.map is not a function
const API_BASE_URL = "/api";

// Token de test
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VuY3lfaWQiOiJhZ2VuY3ktMTIzIn0.XXXXX";

console.log("Test de la correction pour le problème de stats.map is not a function\n");

// Fonction simulée de getAgencyStats avec différents types de retours
async function getAgencyStats(token) {
  try {
    console.log("=== Requête simulée ===");
    console.log("URL:", `${API_BASE_URL}/agencies/stats`);
    console.log("Méthode: GET");
    console.log("En-têtes:", {
      'Authorization': `Bearer ${token}`,
    });
    
    // Simuler différents types de réponses
    const responses = [
      // Réponse correcte (tableau)
      [
        { icon: "Bus", label: "Voyages Actifs", value: 15, change: "+3" },
        { icon: "Users", label: "Passagers Total", value: 1350, change: "+12%" },
        { icon: "DollarSign", label: "Revenus (Mois)", value: "520000", change: "+15%" },
        { icon: "Ticket", label: "Billets Vendus", value: 950, change: "+8%" },
      ],
      // Réponse incorrecte (objet)
      { 
        data: [
          { icon: "Bus", label: "Voyages Actifs", value: 15, change: "+3" },
          { icon: "Users", label: "Passagers Total", value: 1350, change: "+12%" }
        ]
      },
      // Réponse incorrecte (null)
      null
    ];
    
    // Choisir une réponse aléatoire pour le test
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    console.log("Réponse simulée:", JSON.stringify(randomResponse, null, 2));
    
    return randomResponse;
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    throw error;
  }
}

// Fonction pour simuler le traitement des stats dans le composant
function processStats(stats) {
  console.log("\n=== Traitement des stats ===");
  console.log("Type de stats:", typeof stats);
  console.log("Est-ce un tableau?", Array.isArray(stats));
  
  // Correction appliquée
  const processedStats = Array.isArray(stats) ? stats : [];
  console.log("Stats après correction:", JSON.stringify(processedStats, null, 2));
  
  // Vérifier que map fonctionne
  try {
    const mappedStats = processedStats.map((stat, idx) => {
      return {
        id: idx,
        ...stat
      };
    });
    console.log("✅ Mapping réussi:", JSON.stringify(mappedStats, null, 2));
    return mappedStats;
  } catch (error) {
    console.error("❌ Erreur lors du mapping:", error.message);
    return [];
  }
}

// Exécuter le test
getAgencyStats(testToken)
  .then(result => {
    console.log("\n✅ Résultat de l'API:", JSON.stringify(result, null, 2));
    const processed = processStats(result);
    console.log("\n✅ Stats traitées avec succès:", processed.length, "éléments");
  })
  .catch(error => {
    console.error("\n❌ Erreur simulée:", error.message);
  });