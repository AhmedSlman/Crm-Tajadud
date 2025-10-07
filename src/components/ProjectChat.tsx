'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, MessageSenderType } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Send, User, Trash2, CheckCheck, Check } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { getAvatarUrl } from '@/lib/config';

type ProjectChatProps = {
  projectId: string;
  isClient?: boolean;
  currentUserId?: string;
  currentUserType?: MessageSenderType;
  onMessagesRead?: () => void;
};

export default function ProjectChat({ projectId, isClient = false, currentUserId, currentUserType, onMessagesRead }: ProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    // Refresh messages every 10 seconds
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await api.messages.getProjectMessages(projectId, isClient);
      setMessages(data);
      
      // Mark messages as read if they're from other party
      const unreadMessages = data.filter(m => 
        !m.read && 
        m.senderType !== currentUserType
      );
      
      if (unreadMessages.length > 0) {
        // Mark all as read
        await api.messages.markAllAsRead(projectId, isClient);
        
        // Notify parent component that messages are read
        if (onMessagesRead) {
          onMessagesRead();
        }
      }
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    setSending(true);
    try {
      const response = await api.messages.sendMessage(projectId, newMessage.trim(), [], isClient);
      
      // Add message to local state optimistically
      setMessages([...messages, response.data]);
      setNewMessage('');
      scrollToBottom();
      
      toast.success('Message sent! 📧');
    } catch (error) {
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Delete this message?')) return;

    try {
      await api.messages.deleteMessage(messageId, isClient);
      setMessages(messages.filter(m => m.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const isMyMessage = (message: Message) => {
    return message.sender?.id === currentUserId && message.senderType === currentUserType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-[#563EB7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-[#14102a] rounded-xl border border-[#563EB7]/20">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#563EB7]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {isClient ? 'Chat with Project Manager' : 'Client Communication'}
            </h3>
            <p className="text-xs text-gray-400">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <div className="px-3 py-1 bg-[#563EB7] rounded-full text-xs font-semibold text-white">
            {unreadCount} new
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[#563EB7]/10 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-[#563EB7]" />
            </div>
            <h4 className="text-white font-semibold mb-2">No messages yet</h4>
            <p className="text-gray-400 text-sm">
              {isClient 
                ? 'Start a conversation with your project manager'
                : 'Start a conversation with your client'
              }
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isMine = isMyMessage(message);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    {!isMine && message.sender && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        {message.sender.avatar ? (
                          <img
                            src={getAvatarUrl(message.sender.avatar)}
                            alt={message.sender.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] flex items-center justify-center">
                            <User size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && message.sender && (
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-medium text-white">
                            {message.sender.name}
                          </span>
                          {message.sender.role && (
                            <span className="text-xs text-gray-500 capitalize">
                              {message.sender.role.replace('-', ' ')}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isMine
                            ? 'bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] text-white'
                            : 'bg-[#1a1333] text-white border border-[#563EB7]/20'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, idx) => (
                              <div
                                key={idx}
                                className="text-xs opacity-80 hover:opacity-100 transition-opacity"
                              >
                                📎 {typeof attachment === 'string' ? attachment : attachment.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 mt-1 px-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(message.createdAt)}
                        </span>
                        {isMine && (
                          <>
                            {message.read ? (
                              <CheckCheck size={14} className="text-blue-400" />
                            ) : (
                              <Check size={14} className="text-gray-500" />
                            )}
                          </>
                        )}
                        {isMine && (
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#563EB7]/20">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isClient ? 'Message your project manager...' : 'Message your client...'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={sending}
              className="resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}

