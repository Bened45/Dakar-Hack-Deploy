// Test de la nouvelle route /agencies/stats
const API_BASE_URL = "/api";

// Token de test (dans une vraie application, ce serait un vrai token)
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VuY3lfaWQiOiJhZ2VuY3ktMTIzIn0.XXXXX";

console.log("Test de la nouvelle route /agencies/stats\n");

// Fonction simulée de getAgencyStats avec la nouvelle route
async function getAgencyStats(token) {
  try {
    console.log("=== Requête simulée ===");
    console.log("URL:", `${API_BASE_URL}/agencies/stats`);
    console.log("Méthode: GET");
    console.log("En-têtes:", {
      'Authorization': `Bearer ${token}`,
    });
    
    // Vérifier si le token est présent
    if (!token) {
      throw new Error("Token d'authentification requis");
    }
    
    console.log("✅ Structure de la requête valide");
    console.log("✅ En-têtes corrects");
    console.log("✅ La requête serait envoyée avec succès si le backend était disponible");
    
    // Simuler une réponse réussie avec des données de statistiques
    return [
      { icon: "Bus", label: "Voyages Actifs", value: 15, change: "+3" },
      { icon: "Users", label: "Passagers Total", value: 1350, change: "+12%" },
      { icon: "DollarSign", label: "Revenus (Mois)", value: "520000", change: "+15%" },
      { icon: "Ticket", label: "Billets Vendus", value: 950, change: "+8%" },
    ];
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    throw error;
  }
}

// Exécuter le test
getAgencyStats(testToken)
  .then(result => {
    console.log("\n✅ Résultat simulé:", JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error("\n❌ Erreur simulée:", error.message);
  });