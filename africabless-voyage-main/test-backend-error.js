// Test de différentes réponses possibles du backend
const API_BASE_URL = "/api";

// Données de test
const routeData = {
  origin: "Dakar",
  destination: "Podor",
  duration: 5000
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VuY3lfaWQiOiJhZ2VuY3ktMTIzIiwicm9sZSI6ImFnZW5jeSIsImV4cCI6MTc2MjI4OTc2M30.XXXXX";

console.log("Test de différentes réponses possibles du backend\n");
console.log("Données de test:", routeData);

// Simuler différentes réponses d'erreur possibles
const possibleErrors = [
  {
    name: "Token invalide",
    status: 403,
    response: { detail: "Not authenticated" },
    description: "Le token n'est pas reconnu par le backend"
  },
  {
    name: "Mauvais rôle",
    status: 403,
    response: { detail: "Insufficient permissions" },
    description: "L'utilisateur n'a pas le rôle requis pour cette action"
  },
  {
    name: "Token expiré",
    status: 401,
    response: { detail: "Token has expired" },
    description: "Le token a expiré"
  },
  {
    name: "Données invalides",
    status: 400,
    response: { detail: "Invalid data provided" },
    description: "Les données envoyées ne sont pas valides"
  }
];

// Fonction pour tester la création d'itinéraire avec différentes réponses
async function testCreateRouteWithErrorHandling(token, origin, destination, duration) {
  try {
    console.log("\n=== Test de création d'itinéraire ===");
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
    
    // Simuler l'erreur 403 "Not authenticated" que nous avons observée
    const errorResponse = {
      status: 403,
      statusText: "Forbidden",
      detail: "Not authenticated"
    };
    
    console.log("\n❌ Erreur simulée:", errorResponse);
    
    // Vérifier si c'est une erreur d'authentification
    if (errorResponse.status === 403 && errorResponse.detail === "Not authenticated") {
      console.log("🔍 Analyse de l'erreur:");
      console.log("  - Le token est présent mais n'est pas reconnu");
      console.log("  - Possibilités:");
      console.log("    1. Le token a un format incorrect");
      console.log("    2. Le token n'est pas valide côté backend");
      console.log("    3. L'utilisateur n'a pas le rôle requis");
      console.log("    4. L'endpoint nécessite des permissions spécifiques");
      
      // Suggestion de solutions
      console.log("\n💡 Solutions possibles:");
      console.log("  1. Vérifier que le token est généré par le bon endpoint");
      console.log("  2. Vérifier que le backend attend le bon format de token");
      console.log("  3. Vérifier que l'utilisateur a le rôle 'agency'");
      console.log("  4. Vérifier les permissions de l'endpoint /routes");
      console.log("  5. Essayer de se reconnecter pour obtenir un nouveau token");
    }
    
    throw new Error(`HTTP error! status: ${errorResponse.status}, message: ${JSON.stringify(errorResponse)}`);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    throw error;
  }
}

// Fonction pour suggérer des solutions
function suggestSolutions() {
  console.log("\n=== Solutions suggérées ===");
  console.log("1. Vérifier la connexion:");
  console.log("   - Se déconnecter et se reconnecter");
  console.log("   - Vérifier que les identifiants sont corrects");
  
  console.log("\n2. Vérifier le token:");
  console.log("   - Comparer le format avec la documentation du backend");
  console.log("   - Vérifier que le token n'est pas expiré");
  
  console.log("\n3. Vérifier les permissions:");
  console.log("   - Confirmer que le rôle 'agency' est requis");
  console.log("   - Vérifier que l'endpoint /routes accepte les requêtes d'agences");
  
  console.log("\n4. Contacter le support:");
  console.log("   - Si le problème persiste, contacter l'équipe backend");
}

// Exécuter le test
testCreateRouteWithErrorHandling(token, routeData.origin, routeData.destination, routeData.duration)
  .then(() => {
    console.log("\n✅ Test terminé avec succès");
  })
  .catch(error => {
    console.log("\n❌ Test terminé avec erreur");
    suggestSolutions();
  });