import { MessageCircle, X, Send, Bot, Sparkles, ThumbsUp, ThumbsDown, RefreshCw, Star, Calendar, DollarSign, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export function Chatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [userReservations, setUserReservations] = useState([]);
  const messagesEndRef = useRef(null);

  // Only show for clients
  if (user?.role !== 'client') {
    return null;
  }

  // Intelligent predefined responses based on real data
  const knowledgeBase = {
    greetings: {
      patterns: ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey'],
      responses: [
        `Bonjour {name}! 👋 Je suis votre assistant virtuel HotelManager Pro. Comment puis-je vous aider aujourd'hui?`,
        `Heureux de vous revoir {name}! 😊 Que puis-je faire pour vous?`,
        `Bienvenue {name}! 🌟 Je suis là pour répondre à toutes vos questions sur vos réservations.`,
      ]
    },
    reservation: {
      patterns: ['réservation', 'réserver', 'book', 'réserve', 'booking'],
      responses: [
        `Pour faire une réservation, rendez-vous dans la section "Hôtels Disponibles". Choisissez votre hôtel préféré, sélectionnez une chambre, puis indiquez vos dates de séjour. Le prix total sera calculé automatiquement! 🏨`,
        `C'est simple! Cliquez sur "Nouvelle Réservation" dans votre tableau de bord ou explorez nos hôtels. Vous pouvez voir les photos, les équipements et les tarifs en temps réel. ✨`,
      ]
    },
    cancel: {
      patterns: ['annuler', 'annulation', 'cancel', 'supprimer'],
      responses: [
        `Vous pouvez annuler une réservation en allant dans "Mes Réservations". Seules les réservations avec le statut "En attente" peuvent être annulées. Cliquez sur le bouton "Annuler" à côté de la réservation concernée. ⚠️`,
        `Pour annuler: Mes Réservations → Trouvez votre réservation → Bouton "Annuler" (disponible uniquement pour le statut "En attente"). Souhaitez-vous que je vous montre vos réservations en attente? 📋`,
      ]
    },
    payment: {
      patterns: ['paiement', 'payer', 'payment', 'carte', 'prix', 'tarif'],
      responses: [
        `Nous acceptons plusieurs moyens de paiement: Carte Bancaire, Espèces, et Virement Bancaire. Le paiement est sécurisé et confirmé instantanément. 💳`,
        `Les tarifs sont calculés automatiquement en fonction du nombre de nuits et du prix de la chambre. Vous pouvez voir le détail avant de confirmer votre réservation. 💰`,
      ]
    },
    status: {
      patterns: ['statut', 'status', 'état', 'confirmation'],
      responses: [
        `Vos réservations passent par plusieurs statuts: En attente → Confirmée → Check-in → Check-out. Vous recevrez une notification à chaque changement. 📊`,
        `Le statut "En attente" signifie que votre réservation est en cours de validation par l'administrateur. Une fois confirmée, vous recevrez une confirmation. ✅`,
      ]
    },
    amenities: {
      patterns: ['équipement', 'services', 'amenities', 'wifi', 'piscine', 'restaurant'],
      responses: [
        `Nos hôtels offrent divers équipements: WiFi gratuit, Restaurant, Parking, Centre de fitness, Spa, et Piscine. Les équipements varient selon l'hôtel choisi. 🏊‍♂️`,
        `Chaque hôtel dispose de ses propres équipements. Vous pouvez les voir en cliquant sur un hôtel dans la section "Hôtels Disponibles". 🌟`,
      ]
    },
    contact: {
      patterns: ['contact', 'téléphone', 'email', 'joindre', 'support'],
      responses: [
        `Notre équipe support est disponible 24/7. Vous pouvez nous contacter via ce chat, par email à support@hotelmanager.tn, ou par téléphone au +216 70 123 456. 📞`,
        `Besoin d'aide? Notre équipe est là pour vous! Email: support@hotelmanager.tn | Tél: +216 70 123 456 | Chat: disponible maintenant 💬`,
      ]
    },
    checkin: {
      patterns: ['check-in', 'arrivée', 'check in', 'entrer'],
      responses: [
        `Le check-in se fait généralement à partir de 14h. Présentez-vous à la réception de l'hôtel avec votre pièce d'identité et votre confirmation de réservation. 🕐`,
        `À votre arrivée, l'équipe de l'hôtel vous accueillera et vous remettra les clés de votre chambre. N'oubliez pas votre confirmation! 🗝️`,
      ]
    },
    checkout: {
      patterns: ['check-out', 'départ', 'check out', 'partir'],
      responses: [
        `Le check-out doit être effectué avant 12h. Veuillez libérer la chambre et remettre les clés à la réception. Bon séjour! 👋`,
        `Avant de partir, assurez-vous d'avoir réglé toutes les dépenses supplémentaires. Le check-out se fait avant midi. ⏰`,
      ]
    },
    modify: {
      patterns: ['modifier', 'changer', 'update', 'modification'],
      responses: [
        `Pour modifier une réservation, veuillez contacter notre support. Les modifications sont sujettes à disponibilité et peuvent entraîner des frais supplémentaires. 📝`,
        `Les modifications (dates, nombre de personnes) doivent être validées par l'administration. Contactez-nous via le chat ou par téléphone. 📞`,
      ]
    },
    thanks: {
      patterns: ['merci', 'thank', 'super', 'génial', 'parfait'],
      responses: [
        `Je vous en prie! 😊 N'hésitez pas si vous avez d'autres questions.`,
        `Avec plaisir! 🌟 Je suis là pour vous aider anytime!`,
        `Ravi d'avoir pu vous aider! 💫 Bonne journée!`,
      ]
    },
  };

  // Smart suggestions based on user data
  const getSmartSuggestions = () => {
    const pendingCount = userReservations.filter(r => r.status === 'pending').length;
    const confirmedCount = userReservations.filter(r => r.status === 'confirmed').length;
    const totalSpent = userReservations
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0);

    const suggestions = [];

    if (pendingCount > 0) {
      suggestions.push({
        icon: Calendar,
        text: `J'ai ${pendingCount} réservation(s) en attente`,
        query: 'pending'
      });
    }

    if (confirmedCount > 0) {
      suggestions.push({
        icon: Star,
        text: `Voir mes réservations confirmées`,
        query: 'confirmed'
      });
    }

    if (totalSpent > 0) {
      suggestions.push({
        icon: DollarSign,
        text: `J'ai dépensé ${totalSpent} TND cette année`,
        query: 'spending'
      });
    }

    suggestions.push(
      { icon: Calendar, text: 'Comment faire une réservation?', query: 'reservation' },
      { icon: MessageCircle, text: 'Comment annuler une réservation?', query: 'cancel' },
      { icon: DollarSign, text: 'Quels sont les moyens de paiement?', query: 'payment' },
      { icon: Star, text: 'Quels services sont inclus?', query: 'amenities' }
    );

    return suggestions.slice(0, 4);
  };

  // Fetch user reservations for smart responses
  useEffect(() => {
    if (isOpen && userReservations.length === 0) {
      api.get('/reservations/my-reservations')
        .then(res => setUserReservations(res.data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const greeting = knowledgeBase.greetings.responses[
          Math.floor(Math.random() * knowledgeBase.greetings.responses.length)
        ].replace('{name}', user?.name?.split(' ')[0] || 'notre client');
        
        setMessages([
          {
            id: 1,
            type: 'bot',
            text: greeting,
            timestamp: new Date()
          }
        ]);
      }, 500);
    }
  }, [isOpen]);

  const findBestResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific data queries
    if (lowerQuery.includes('pending') || lowerQuery.includes('attente')) {
      const pending = userReservations.filter(r => r.status === 'pending');
      if (pending.length > 0) {
        return `Vous avez ${pending.length} réservation(s) en attente de confirmation:\n\n${pending.map(r => `• ${r.reservationNumber} - ${r.hotel?.name}`).join('\n')}\n\nL'administrateur les confirmera bientôt! ⏳`;
      }
      return `Vous n'avez aucune réservation en attente. Toutes vos réservations sont confirmées! ✅`;
    }

    if (lowerQuery.includes('confirmed') || lowerQuery.includes('confirmée')) {
      const confirmed = userReservations.filter(r => r.status === 'confirmed');
      if (confirmed.length > 0) {
        return `Vous avez ${confirmed.length} réservation(s) confirmée(s):\n\n${confirmed.map(r => `• ${r.reservationNumber} - ${r.hotel?.name} (${new Date(r.checkInDate).toLocaleDateString()})`).join('\n')}\n\nHâte de vous accueillir! 🎉`;
      }
      return `Vous n'avez pas de réservations confirmées pour le moment.`;
    }

    if (lowerQuery.includes('spent') || lowerQuery.includes('dépensé') || lowerQuery.includes('prix')) {
      const total = userReservations
        .filter(r => r.paymentStatus === 'completed')
        .reduce((sum, r) => sum + r.totalPrice, 0);
      return `Vous avez dépensé un total de ${total} TND dans nos hôtels cette année. Merci pour votre confiance! 💰`;
    }

    // Find matching category
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.patterns.some(pattern => lowerQuery.includes(pattern))) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default response
    return `Je ne suis pas sûr de comprendre votre question. 😕\n\nJe peux vous aider avec:\n• Les réservations\n• Les annulations\n• Les paiements\n• Les équipements\n• Les check-in/check-out\n\nOu contactez notre support humain pour une assistance personnalisée! 📞`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = findBestResponse(inputValue);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: botResponse,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSuggestion = (query) => {
    setInputValue(query);
    setTimeout(() => handleSend(), 100);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'new_reservation':
        window.location.href = '/client/hotels';
        break;
      case 'my_reservations':
        window.location.href = '/client/reservations';
        break;
      case 'contact_support':
        handleSuggestion('contact');
        break;
    }
  };

  const suggestions = getSmartSuggestions();

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary shadow-lg shadow-secondary/30 flex items-center justify-center z-40 transition-all hover:scale-110 animate-pulse"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary to-amber-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bot className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg">Assistant Virtuel</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-primary/90 font-medium">En ligne • Réponse instantanée</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="text-primary" size={20} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-slate-800/50 border-b border-slate-700">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => handleQuickAction('new_reservation')}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-lg whitespace-nowrap transition-colors"
              >
                <Calendar className="text-secondary" size={16} />
                <span className="text-sm text-secondary font-medium">Nouvelle Réservation</span>
              </button>
              <button
                onClick={() => handleQuickAction('my_reservations')}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg whitespace-nowrap transition-colors"
              >
                <Users className="text-blue-400" size={16} />
                <span className="text-sm text-blue-400 font-medium">Mes Réservations</span>
              </button>
              <button
                onClick={() => handleQuickAction('contact_support')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg whitespace-nowrap transition-colors"
              >
                <MessageCircle className="text-purple-400" size={16} />
                <span className="text-sm text-purple-400 font-medium">Support</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900 to-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-primary" size={16} />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-secondary to-amber-600 text-primary rounded-br-md'
                        : 'bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-2 mt-2 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                      <span className="text-xs opacity-60">
                        {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.type === 'bot' && (
                        <div className="flex gap-1">
                          <button className="hover:text-green-400 transition-colors">
                            <ThumbsUp size={12} />
                          </button>
                          <button className="hover:text-red-400 transition-colors">
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-amber-600 rounded-full flex items-center justify-center">
                    <Bot className="text-primary" size={16} />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="p-4 bg-slate-800/30 border-t border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-secondary" size={16} />
                <span className="text-xs text-slate-400 font-medium">Suggestions intelligentes</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(suggestion.query)}
                      className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-secondary/50 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-secondary group-hover:scale-110 transition-transform" size={18} />
                        <span className="text-sm text-slate-300 group-hover:text-white">{suggestion.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-secondary to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Assistant IA • Réponses instantanées • Disponible 24/7
            </p>
          </div>
        </div>
      )}
    </>
  );
}
