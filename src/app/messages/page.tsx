"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "../components/Header";
import { useRouter, useParams } from "next/navigation";

const mockConversations = [
  { id: 1, name: "Alice", lastMessage: "Hey there!" },
  { id: 2, name: "Bob", lastMessage: "Let's catch up." },
  { id: 3, name: "Charlie", lastMessage: "Did you see that?" },
  { id: 4, name: "Alice", lastMessage: "Hey there!" },
  { id: 5, name: "Bob", lastMessage: "Let's catch up." },
  { id: 6, name: "Charlie", lastMessage: "Did you see that?" },
  { id: 7, name: "Alice", lastMessage: "Hey there!" },
  { id: 8, name: "Bob", lastMessage: "Let's catch up." },
  { id: 9, name: "Charlie", lastMessage: "Did you see that?" },
  { id: 10, name: "Alice", lastMessage: "Hey there!" },
  { id: 11, name: "Bob", lastMessage: "Let's catch up." },
  { id: 12, name: "Charlie", lastMessage: "Did you see that?" },
  { id: 13, name: "Alice", lastMessage: "Hey there!" },
  { id: 14, name: "Bob", lastMessage: "Let's catch up." },
  { id: 15, name: "Charlie", lastMessage: "Did you see that?" },
  { id: 16, name: "Alice", lastMessage: "Hey there!" },
  { id: 17, name: "Bob", lastMessage: "Let's catch up." },
  { id: 18, name: "Charlie", lastMessage: "Did you see that?" },
];

const mockChat = [
  { from: "them", text: "Hey, how's it going?" },
  { from: "me", text: "All good! You?" },
  { from: "them", text: "Doing great, thanks!" },
];

export default function Messages() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = React.useState<
    number | null
  >(null);

  const activeChat = mockConversations.find(
    (c) => c.id === selectedConversation
  );

  return (
    <div>
      <Header user={user} logout={logout} />
      <main className="flex-1 text-left py-0 md:py-6 px-0 md:px-[clamp(1rem,2vw,10rem)]">
        <div className="mx-auto w-full max-w-[1280px] flex flex-col md:flex-row">
          {/* Conversation List */}
          <div
            className={`
            relative z-0 w-full md:w-1/2 divide-y border-0
            md:overflow-y-auto
            md:border md:rounded-l-lg md:[border-width:1.5px] md:border-gray-300
          `}
            style={{ height: "85vh" }}
          >
            {mockConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    router.push(`/chat/${conv.id}`);
                  } else {
                    setSelectedConversation(conv.id); // for desktop
                  }
                }}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition ${
                  selectedConversation === conv.id ? "bg-gray-100" : ""
                }`}
              >
                <h3 className="font-semibold">{conv.name}</h3>
                <p className="text-sm text-gray-600">{conv.lastMessage}</p>
              </div>
            ))}
          </div>

          {/* Chat Box */}
          <div
            className="hidden md:block md:w-1/2 md:border-t md:border-r md:border-b md:border-gray-300 md:rounded-r-lg md:[border-top-width:1.5px] md:[border-right-width:1.5px] md:[border-bottom-width:1.5px]"
            style={{ height: "85vh" }}
          >
            <div className="p-4 h-full flex flex-col">
              {activeChat ? (
                <>
                  <h2 className="text-lg font-bold mb-4">
                    Chat with {activeChat.name}
                  </h2>
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {mockChat.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg max-w-[70%] ${
                          msg.from === "me"
                            ? "bg-green-100 self-end"
                            : "bg-gray-100 self-start"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      style={{ borderWidth: "1.5px" }}
                      className=" border-gray-300 rounded-lg px-3 py-2 w-full max-w-md  font-base my-2 focus:outline-none focus:border-black"
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-300">
                  Select a conversation to start chatting.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
