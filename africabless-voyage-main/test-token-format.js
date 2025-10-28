// Test du format du token retourné par agencyLogin
const API_BASE_URL = "/api";

// Données de test pour la connexion
const loginData = {
  email: "agence@example.com",
  password: "motdepasse123"
};

console.log("Test du format du token retourné par agencyLogin\n");
console.log("Données de connexion:", loginData);

// Fonction simulée de agencyLogin
async function agencyLogin(email, password) {
  try {
    console.log("\n=== Requête de connexion ===");
    console.log("URL:", `${API_BASE_URL}/agencies/login`);
    console.log("Méthode: POST");
    console.log("En-têtes:", {
      'Content-Type': 'application/json',
    });
    console.log("Corps de la requête:", JSON.stringify({
      email,
      password
    }, null, 2));
    
    // Simuler une réponse réussie avec un token
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VuY3lfaWQiOiJhZ2VuY3ktMTIzIiwicm9sZSI6ImFnZW5jeSIsImV4cCI6MTc2MjI4OTc2M30.XXXXX";
    
    console.log("\n✅ Connexion réussie");
    console.log("✅ Token reçu:", mockToken);
    console.log("✅ Longueur du token:", mockToken.length);
    
    return mockToken;
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    throw error;
  }
}

// Fonction simulée de createRoute pour tester avec le token
async function createRoute(token, origin, destination, duration) {
  try {
    console.log("\n=== Requête de création d'itinéraire ===");
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
    
    // Vérifier le format du token
    if (!token) {
      throw new Error("Token manquant");
    }
    
    if (!token.startsWith("eyJ")) {
      throw new Error("Format de token invalide - ne commence pas par 'eyJ'");
    }
    
    console.log("\n✅ Token présent et format correct");
    console.log("✅ Requête correctement formatée");
    
    // Simuler une réponse réussie
    return {
      id: "route-123",
      origin,
      destination,
      duration,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    throw error;
  }
}

// Exécuter le test complet
async function runFullTest() {
  try {
    // 1. Connexion
    console.log("=== Étape 1: Connexion ===");
    const token = await agencyLogin(loginData.email, loginData.password);
    
    // 2. Création d'itinéraire
    console.log("\n=== Étape 2: Création d'itinéraire ===");
    const routeData = {
      origin: "Dakar",
      destination: "Podor",
      duration: 5000
    };
    
    const result = await createRoute(token, routeData.origin, routeData.destination, routeData.duration);
    console.log("\n✅ Résultat final:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Erreur dans le test complet:", error.message);
  }
}

// Exécuter le test
runFullTest();