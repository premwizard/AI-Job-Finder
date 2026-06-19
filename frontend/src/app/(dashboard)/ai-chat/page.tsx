"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Send, User, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestedPrompts = [
  "Analyze my resume",
  "Find AI jobs",
  "What skills should I learn?",
  "Why was this job recommended?"
];

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "Hello! I'm your AI Career Assistant. I've analyzed your resume and the current job market. How can I help you today?"
  }
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I've received your request. Since I'm currently running in a mock environment, I cannot perform live data retrieval right now. However, once connected to the backend RAG and Agent system, I will provide highly personalized career advice, analyze job descriptions against your resume, and generate customized materials for you."
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            AI Career Assistant
          </h2>
          <p className="text-muted-foreground text-sm">Powered by advanced RAG & Agentic AI</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setMessages(initialMessages)}>
          <Plus className="w-4 h-4" /> New Chat
        </Button>
      </div>

      <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          <div className="space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary border border-primary/30"
                )}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm leading-relaxed whitespace-pre-wrap"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/20 text-primary border border-primary/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5 h-[44px]">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-border/50 bg-background/50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedPrompts.map((prompt, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors py-1.5 px-3"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </Badge>
                ))}
              </div>
            )}
            <div className="relative flex items-center">
              <Input
                placeholder="Ask your AI Career Assistant anything..."
                className="pr-12 py-6 rounded-xl bg-background border-border shadow-sm focus-visible:ring-primary/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button 
                size="icon" 
                className="absolute right-2 rounded-lg h-9 w-9" 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              AI can make mistakes. Verify important career advice.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
