'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Search, User, Store } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../../lib/api';
import { useAuthStore } from '../../../lib/auth-store';
import { formatDate } from '../../../lib/utils';

export default function BoutiqueMessagingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingApi.getConversations(),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const { data: messagesData = [], isLoading: loadingMessages } = useQuery({
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
  }, [messagesData]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConv) return;
    sendMutation.mutate(message.trim());
  };

  const convList = Array.isArray(conversations) ? conversations : [];
  const msgList = Array.isArray(messagesData) ? messagesData : [];

  const filteredConvs = convList.filter((c: any) => {
    if (!searchConv) return true;
    const name = `${c.client?.firstName} ${c.client?.lastName}`.toLowerCase();
    return name.includes(searchConv.toLowerCase());
  });

  const selectedConvData = convList.find((c: any) => c.id === selectedConv);
  const otherUser = selectedConvData
    ? (user?.role === 'boutique' ? selectedConvData.client : selectedConvData.boutique)
    : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Conversations avec vos clients</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex h-full">
          {/* Conversations sidebar */}
          <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchConv}
                  onChange={(e) => setSearchConv(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loadingConvs ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : filteredConvs.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                  <p>Aucune conversation</p>
                </div>
              ) : (
                filteredConvs.map((conv: any) => {
                  const otherPerson = user?.role === 'boutique' ? conv.client : conv.boutique;
                  const unread = user?.role === 'boutique' ? conv.boutiqueUnread : conv.clientUnread;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv.id)}
                      className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        selectedConv === conv.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {conv.boutique?.logoUrl && user?.role !== 'boutique'
                          ? <img src={conv.boutique.logoUrl} alt="" className="w-full h-full object-cover" />
                          : <User className="w-5 h-5 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {otherPerson?.firstName
                              ? `${otherPerson.firstName} ${otherPerson.lastName}`
                              : otherPerson?.name ?? 'Client'}
                          </p>
                          {unread > 0 && (
                            <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                              {unread}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Message thread */}
          <div className="flex-1 flex flex-col min-w-0">
            {!selectedConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                <p className="font-medium text-gray-500">Sélectionner une conversation</p>
                <p className="text-sm mt-1">Choisissez un client dans la liste</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {otherUser?.firstName
                        ? `${otherUser.firstName} ${otherUser.lastName}`
                        : otherUser?.name ?? 'Client'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : msgList.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Aucun message, démarrez la conversation
                    </div>
                  ) : (
                    msgList.map((msg: any) => {
                      const isMine = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                              isMine
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || sendMutation.isPending}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-1.5"
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
    </div>
  );
}
