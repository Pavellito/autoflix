import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFavorites } from "@/app/lib/favorites-context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function CopilotChat() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { favorites } = useFavorites();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with the query if it exists
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          favorites: favorites 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages([
        ...newMessages, 
        { role: "assistant", content: `❌ Error: ${e.message}. The AI is currently unavailable.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-4 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-black/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                AutoFlix <span className="text-accent">Copilot</span>
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">
                Your AI-Powered EV Intelligence Platform
              </p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase text-accent tracking-widest">
            Beta Engine
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 animate-fade-in my-auto py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">How can I assist you?</h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Ask about true EV ranges, charging speeds, price comparisons in your country, or request a custom recommendation.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
                msg.role === "user" 
                  ? "bg-accent text-white rounded-br-none shadow-[0_0_15px_rgba(229,9,20,0.3)]" 
                  : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-none prose prose-invert prose-p:leading-relaxed prose-a:text-accent"
              }`}>
                {msg.role === "assistant" ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="font-medium text-[15px]">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-black/80 backdrop-blur-xl z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-end gap-2"
          >
            <div className="relative flex-1 bg-white/5 border border-white/10 rounded-2xl focus-within:border-accent/50 focus-within:bg-white/10 transition-all shadow-inner">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Message AutoFlix Intelligence..."
                className="w-full bg-transparent border-none text-white text-sm md:text-base px-5 py-4 resize-none focus:outline-none focus:ring-0 max-h-32 min-h-[56px]"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-[56px] w-[56px] flex-shrink-0 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shadow-xl group"
            >
               <svg className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
               </svg>
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-600 font-medium mt-3 uppercase tracking-widest">
            AI can make mistakes. Verify critical pricing and range data manually.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function CopilotPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-accent animate-pulse">Initializing Neural Link...</div>}>
      <CopilotChat />
    </Suspense>
  );
}
