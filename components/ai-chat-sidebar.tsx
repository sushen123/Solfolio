"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from '@ai-sdk/react';

export function AIChatSidebar() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/ai/chat',
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Ask AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Ask me anything about your portfolio..."
            className="flex-1"
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit">Get Insights</Button>
        </form>
      </CardContent>
    </Card>
  );
}
