"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatHistory, sendChatMessage, clearChatHistory, ChatMessage } from "@/features/chat/services/chat.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Trash2, Bot, User as UserIcon, Sparkles, ChevronRight, FileText } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const suggestedPrompts = [
  "Find jobs matching my resume.",
  "Which skills should I learn first?",
  "How can I improve my ATS score?",
  "Why is my top job recommended?"
];

export default function AIChatPage() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: getChatHistory
  });

  const clearMutation = useMutation({
    mutationFn: clearChatHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    }
  });

  const chatMutation = useMutation({
    mutationFn: (msg: string) => sendChatMessage(msg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    }
  });

  const messages: ChatMessage[] = historyData?.messages || [];

  const handleSend = (e?: React.FormEvent, overrideMsg?: string) => {
    e?.preventDefault();
    const msg = overrideMsg || inputValue;
    if (!msg.trim()) return;
    
    // Optimistically add user message? The mutation invalidation will fetch it, but let's just let mutation handle it for simplicity.
    setInputValue("");
    chatMutation.mutate(msg);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatMutation.isPending]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4 md:p-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bot className="w-8 h-8 text-indigo-600" /> AI Career Assistant
          </h2>
          <p className="text-slate-500 mt-1">
            Ask questions about your career, resume, and job matches. Answers are grounded in your actual data.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => clearMutation.mutate()} title="Clear Chat History">
          {clearMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-500" />}
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : messages.length === 0 && !chatMutation.isPending ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <div className="p-4 bg-indigo-50 rounded-full">
                <Sparkles className="w-12 h-12 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">How can I help your career today?</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">I can analyze your resume, recommend skills to learn, and explain why certain jobs are a good match for you.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((p, i) => (
                  <Button key={i} variant="outline" className="h-auto py-3 justify-start text-left font-normal text-slate-700 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50" onClick={() => handleSend(undefined, p)}>
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:text-slate-800 prose-pre:border prose-pre:border-slate-200">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {/* Citations */}
                    {msg.role === 'model' && msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.citations.map((cit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200 font-normal">
                            <FileText className="w-3 h-3 mr-1 inline" /> {cit}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Suggested Actions */}
                    {msg.role === 'model' && msg.suggested_actions && msg.suggested_actions.length > 0 && idx === messages.length - 1 && !chatMutation.isPending && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.suggested_actions.map((act, i) => (
                          <Button key={i} variant="outline" size="sm" className="rounded-full text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100" onClick={() => handleSend(undefined, act)}>
                            {act} <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                      <UserIcon className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {chatMutation.isPending && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-12 w-16">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="relative flex items-center">
            <Input 
              placeholder="Ask anything about your career or job matches..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-12 h-14 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
              disabled={chatMutation.isPending}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || chatMutation.isPending}
              className="absolute right-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">AI Assistant can make mistakes. Verify important information.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
