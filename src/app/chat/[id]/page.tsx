// app/chat/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function ChatPage() {
  const { id } = useParams();

  return (
    <div className="h-screen w-screen p-4">
      <h1 className="text-xl font-bold">Chat with ID: {id}</h1>
      {/* Replace below with your ChatBox component */}
      <div className="mt-4 h-[calc(100vh-100px)] overflow-y-auto p-4">
        <p>Messages go here...</p>
      </div>
    </div>
  );
}
