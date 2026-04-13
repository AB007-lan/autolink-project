'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, MessageSquare, Search, ArrowLeft, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { Header } from '../../../components/layout/Header';

export default function MessagingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();

  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingApi.getConversations(),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConv],
    queryFn: () => messagingApi.getMessages(selectedConv!),
    enabled: !!selectedConv,
    refetchInterval: 5000,
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      messagingApi.sendMessage({ conversationId: selectedConv, content: text }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', selectedConv] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
      setMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConv) return;
    sendMutation.mutate(message.trim());
  };

  const filteredConversations = Array.isArray(conversations)
    ? conversations.filter((c: any) => {
        const name = c.otherUser?.firstName + ' ' + c.otherUser?.lastName + ' ' + (c.boutique?.name ?? '');
        return name.toLowerCase().includes(searchConv.toLowerCase());
      })
    : [];

  const currentConv = Array.isArray(conversations)
    ? conversations.find((c: any) => c.id === selectedConv)
    : null;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-4 h-[calc(100vh-64px)]">

        {/* Conversations sidebar */}
        <div className={`flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm w-full md:w-80 flex-shrink-0 ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Chercher une conversation..."
                value={searchConv}
                onChange={(e) => setSearchConv(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Aucune conversation</p>
              </div>
            ) : (
              filteredConversations.map((conv: any) => {
                const other = conv.otherUser ?? conv.boutique;
                const name = conv.boutique?.name ?? (other?.firstName + ' ' + other?.lastName);
                const isSelected = conv.id === selectedConv;
                const hasUnread = conv.unreadCount > 0;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 items-start transition-colors border-b border-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {other?.avatarUrl || conv.boutique?.logoUrl ? (
                        <img
                          src={other?.avatarUrl || conv.boutique?.logoUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-semibold text-sm">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {name}
                        </p>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className={`text-xs truncate ${hasUnread ? 'text-gray-700' : 'text-gray-400'}`}>
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {hasUnread && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Sélectionnez une conversation</p>
                <p className="text-sm text-gray-300 mt-1">pour voir les messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <button
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedConv(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {currentConv && (
                  <>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {currentConv.boutique?.name ??
                          (currentConv.otherUser?.firstName + ' ' + currentConv.otherUser?.lastName)}
                      </p>
                      <p className="text-xs text-green-500">En ligne</p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (Array.isArray(messages) ? messages : []).map((msg: any) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sendMutation.isPending}
                    className="w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
