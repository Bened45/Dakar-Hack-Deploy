import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Globe, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { marked } from "marked";

const CHATBOT_STORAGE_KEY = "bitbot_conversation_history";

// ═══════════════════════════════════════════════════════════
// 🔥 FONCTION DE STREAMING (À AJOUTER)
// ═══════════════════════════════════════════════════════════
async function sendMessageToBitBot(userMessage: string, onChunk: (text: string) => void) {
  try {
    // Appeler l'API avec streaming
    const response = await fetch('http://localhost:8000/chat/plain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    // Lire le stream
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('✅ Réponse complète');
        break;
      }

      // Décoder le chunk
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      
      // Appeler le callback avec le texte complet accumulé
      onChunk(fullText);
    }

    return fullText;

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions rapides selon la langue
  const quickSuggestions = {
    fr: [
      "Qu'est ce que BitTravel?",
      "Comment rechercher un trajet?",
      "Comment payer un ticket?",
      "Comment se passe la vérification des tickets?"
    ],
    wo: [
      "BitTravel lan la?",
      "Nañuy wut tukki ci BitTravel?",
      "Nañuy fay tiké bi?",
      "Nan lañuy seetalé tiké yi?"
    ]
  };

  // Charger l'historique depuis localStorage au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHATBOT_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const recentConversations = parsedHistory.filter((conv: any) => {
          const convTime = new Date(conv.timestamp).getTime();
          const now = new Date().getTime();
          return (now - convTime) < (24 * 60 * 60 * 1000);
        });
        if (recentConversations.length > 0) {
          setMessages(recentConversations[recentConversations.length - 1].messages);
        }
      } catch (e) {
        console.error("Erreur lors du chargement de l'historique:", e);
      }
    }
  }, []);

  // Sauvegarder l'historique dans localStorage
  useEffect(() => {
    if (messages.length > 1) {
      const conversation = {
        timestamp: new Date().toISOString(),
        language,
        messages
      };
      
      const savedHistory = localStorage.getItem(CHATBOT_STORAGE_KEY);
      let history = savedHistory ? JSON.parse(savedHistory) : [];
      
      history.push(conversation);
      
      if (history.length > 10) {
        history = history.slice(-10);
      }
      
      localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(history));
    }
  }, [messages, language]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: language === "fr"
            ? "Bonjour! Comment puis-je vous aider avec votre voyage aujourd'hui?"
            : "Salaam aleekum! Naka nga def pour votre voyage?",
        },
      ]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // ═══════════════════════════════════════════════════════════
  // 🔥 FONCTION handleSend MODIFIÉE POUR LE STREAMING
  // ═══════════════════════════════════════════════════════════
  const handleSend = async (msgToSend: string = message) => {
    if (!msgToSend.trim() || isBotTyping) return;

    const userMessage = { 
      role: "user", 
      content: msgToSend, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsBotTyping(true);

    // Créer un message vide pour le bot
    const botMessageIndex = messages.length + 1; // Index du futur message bot
    const emptyBotMessage = { 
      role: "assistant", 
      content: "", 
      timestamp: new Date().toISOString() 
    };
    
    setMessages((prev) => [...prev, emptyBotMessage]);

    try {
      // ✨ STREAMING : Mise à jour progressive du message
      await sendMessageToBitBot(msgToSend, (streamedText) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          // Mettre à jour le dernier message (celui du bot)
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: streamedText
          };
          return newMessages;
        });
      });

    } catch (error) {
      console.error("Erreur:", error);
      const errorMessage = language === "fr" 
        ? "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard." 
        : "Naka nga def, ma nga am ci bokk. Jéemaatal ci kanam.";
      
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: errorMessage
        };
        return newMessages;
      });
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(CHATBOT_STORAGE_KEY);
    setMessages([
      {
        role: "assistant",
        content: language === "fr"
          ? "Bonjour! Comment puis-je vous aider avec votre voyage aujourd'hui?"
          : "Salaam aleekum! Naka nga def pour votre voyage?",
      },
    ]);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated bg-gradient-hero hover:opacity-90 animate-scale-in z-50"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed inset-0 w-full h-full rounded-none shadow-elevated flex flex-col animate-slide-up z-50 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[600px] md:rounded-lg">
          <div className="bg-gradient-hero p-4 md:rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Assistant bitTravel</h3>
            </div>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-20 h-8 bg-white/20 border-white/30 text-white text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">FR</SelectItem>
                  <SelectItem value="wo">WO</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-gradient-hero text-white"
                      : "bg-muted text-foreground"
                  }`}
                  dangerouslySetInnerHTML={{ 
                    __html: msg.role === "user" 
                      ? msg.content 
                      : marked.parse(msg.content || '') 
                  }}
                />
              </div>
            ))}
            
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      {language === "fr" ? "BitBot est en train d'écrire..." : "BitBot mi ngi bind..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-b">
              <p className="text-xs text-muted-foreground mb-2">
                {language === "fr" ? "Suggestions rapides :" : "Sugestiyon yu mbirif :"}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions[language as keyof typeof quickSuggestions]?.map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    disabled={isBotTyping}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2 mb-2">
              <Input
                placeholder={language === "fr" ? "Votre message..." : "Ci message bi..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isBotTyping}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSend()} 
                size="icon" 
                className="bg-gradient-hero hover:opacity-90" 
                disabled={isBotTyping || !message.trim()}
              >
                {isBotTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {language === "fr" 
                  ? "Appuyez sur Entrée pour envoyer" 
                  : "Bësal ci Entrer ngir yónnee"}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2" 
                onClick={clearHistory}
              >
                {language === "fr" ? "Effacer" : "Far"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
