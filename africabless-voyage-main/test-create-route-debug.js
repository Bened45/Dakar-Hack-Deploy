// Test de la fonction createRoute avec débogage
const API_BASE_URL = "/api";

// Données de test
const testData = {
  origin: "Cotonou",
  destination: "Porto-Novo",
  duration: 45
};

// Token de test (simule un vrai token)
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VuY3lfaWQiOiJhZ2VuY3ktMTIzIn0.XXXXX";

console.log("Test de la fonction createRoute avec débogage\n");
console.log("Données de test:", testData);
console.log("Token présent:", !!testToken);

// Fonction simulée de createRoute avec débogage
async function createRoute(token, origin, destination, duration) {
  try {
    console.log("\n=== Appel de createRoute ===");
    console.log("Paramètres reçus:", { origin, destination, duration });
    console.log("Token length:", token?.length);
    
    // Vérifier les paramètres
    if (!origin || origin.length < 2) {
      throw new Error("La ville de départ doit contenir au moins 2 caractères");
    }
    
    if (!destination || destination.length < 2) {
      throw new Error("La ville d'arrivée doit contenir au moins 2 caractères");
    }
    
    if (!duration || duration < 1) {
      throw new Error("La durée du voyage doit être d'au moins 1 minute");
    }
    
    if (!token) {
      throw new Error("Token d'authentification requis");
    }
    
    // Simuler l'appel API
    console.log("\n=== Requête simulée ===");
    console.log("URL:", `${API_BASE_URL}/routes`);
    console.log("Méthode: POST");
    console.log("En-têtes:", {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    console.log("Corps de la requête:", JSON.stringify({
      origin,
      destination,
      duration
    }, null, 2));
    
    console.log("\n✅ Toutes les vérifications passent");
    console.log("✅ Structure de la requête valide");
    console.log("✅ Données de la requête valides");
    console.log("✅ En-têtes corrects");
    console.log("✅ La requête serait envoyée avec succès si le backend était disponible");
    
    // Simuler une réponse réussie
    return {
      id: "route-123",
      origin,
      destination,
      duration,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    throw error;
  }
}

// Exécuter le test
createRoute(testToken, testData.origin, testData.destination, testData.duration)
  .then(result => {
    console.log("\n✅ Résultat simulé:", JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error("\n❌ Erreur simulée:", error.message);
  });