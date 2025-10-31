"use client"

import { useState, FormEvent, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  IconArrowElbow,
  IconSparkles,
} from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the message structure
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

// ChatEmptyState Component
const ChatEmptyState = () => (
    <div className="flex flex-1 items-center justify-center rounded-lg border bg-background/50 h-full">
      <div className="flex flex-col items-center text-center p-4">
        <IconSparkles className="h-10 w-10 mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-1">Start a conversation</h2>
        <p className="text-muted-foreground text-sm">
          How can I help you today?
        </p>
      </div>
    </div>
  )

// Main Chat Page Component
export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) throw new Error('The response body is empty.');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessageContent = '';
      const assistantId = `asst-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '▋' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessageContent += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: assistantMessageContent + '▋' } : msg
          )
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, content: assistantMessageContent } : msg
        )
      );
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: 'Sorry, I encountered an error.' },
      ]);
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      {/* 
        SCROLLBAR STYLING ADDED HERE
        - `scrollbar-thin`: Makes the scrollbar smaller.
        - `scrollbar-thumb-neutral-800`: Sets the color of the draggable part.
        - `scrollbar-track-transparent`: Makes the background of the scrollbar invisible.
        - `scrollbar-thumb-rounded-full`: Makes the draggable part rounded.
      */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent scrollbar-thumb-rounded-full"
      >
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          <div className="space-y-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  m.role === "user" ? "justify-end" : ""
                }`}
              >
                {m.role !== "user" && (
                  <Avatar className="h-8 w-8 shrink-0"> {/* Added shrink-0 */}
                    <AvatarImage src="/placeholder-user.jpg" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 text-sm max-w-[85%] break-words ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    // The `dark:prose-invert` class will now work correctly thanks to the ThemeProvider
                    <div className="ai-chat-bubble"> {/* Your custom class */}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                  )}
                </div>
                {m.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0"> {/* Added shrink-0 */}
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative mt-6 flex-shrink-0">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <Label htmlFor="message" className="sr-only">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <div className="flex items-center p-3 pt-0">
            <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={!input.trim()}>
              Send Message
              <IconArrowElbow className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}