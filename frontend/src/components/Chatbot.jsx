import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Bienvenue! Comment puis-je vous aider?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const suggestions = [
    'Comment faire une réservation?',
    'Quelles sont vos tarifs?',
    'Comment annuler une réservation?',
    'Quels sont vos services?',
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages([
      ...messages,
      { id: Date.now(), type: 'user', text: inputValue }
    ]);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Merci pour votre question. Un agent vous répondra bientôt!'
        }
      ]);
    }, 500);

    setInputValue('');
  };

  const handleSuggestion = (suggestion) => {
    setMessages([
      ...messages,
      { id: Date.now(), type: 'user', text: suggestion }
    ]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Je peux vous aider avec cela. Pour plus d\'informations, veuillez contacter notre support.'
        }
      ]);
    }, 500);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-secondary hover:bg-amber-600 text-primary shadow-lg flex items-center justify-center z-40 transition-transform hover:scale-110"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex flex-col z-40">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Support Client</h3>
              <p className="text-xs text-slate-400">Nous répondons en moins de 5 minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-secondary text-primary'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 space-y-2 border-t border-slate-700">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(suggestion)}
                  className="w-full text-left text-xs px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Votre message..."
              className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-secondary"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded bg-secondary hover:bg-amber-600 text-primary transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
