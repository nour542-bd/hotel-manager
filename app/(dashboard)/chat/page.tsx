"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, MessageCircle, Building2, CalendarDays, Users, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatbotResponses, type ChatMessage } from "@/lib/data"

const suggestions = [
  { label: "Reservations", icon: CalendarDays, query: "reservation" },
  { label: "Chambres", icon: Building2, query: "chambre" },
  { label: "Clients", icon: Users, query: "client" },
  { label: "Aide", icon: HelpCircle, query: "aide" },
]

function getBotResponse(message: string): string {
  const lower = message.toLowerCase()
  for (const [key, response] of Object.entries(chatbotResponses)) {
    if (key !== "default" && lower.includes(key)) {
      return response
    }
  }
  return chatbotResponses.default
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Je suis l'assistant HotelManager Pro. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur les reservations, les chambres, les clients, les employes ou les statistiques.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const response = getBotResponse(text)
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestion = (query: string) => {
    sendMessage(query)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Assistant IA</h1>
        <p className="text-sm text-muted-foreground mt-1">Posez vos questions sur la gestion hoteliere</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 flex-1 min-h-0">
        {/* Chat Area */}
        <Card className="border-0 bg-card shadow-sm lg:col-span-3 flex flex-col min-h-0">
          <CardHeader className="border-b border-border/50 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <Bot className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">HotelBot Assistant</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">En ligne</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "assistant" ? "bg-accent" : "bg-primary"
                    }`}>
                      {msg.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-accent-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className={`max-w-[70%] rounded-xl px-4 py-3 ${
                      msg.role === "assistant"
                        ? "bg-muted/50 text-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                      <span className="text-[9px] opacity-60 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Bot className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="rounded-xl bg-muted/50 px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t border-border/50 p-4 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
                  disabled={isTyping}
                />
                <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 h-9 w-9 shrink-0" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar */}
        <div className="flex flex-col gap-4">
          <Card className="border-0 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s.query)}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 text-left transition-colors hover:bg-muted/60"
                  >
                    <s.icon className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm text-foreground">{s.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-accent" />
                Questions Frequentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {[
                  "Comment creer une reservation ?",
                  "Quelles chambres sont disponibles ?",
                  "Voir les statistiques",
                  "Comment gerer les employes ?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 border-b border-border/30 last:border-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
