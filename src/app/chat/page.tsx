'use client'
import { useState, useEffect, useRef } from 'react';
import { Send, Menu, X } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Message } from '@/types/interfaces'
import dayjs from 'dayjs';

export default function ChatUI() {
  const { currentLoggedInUserId } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch users that the current user has conversations with
  useEffect(() => {
    if (currentLoggedInUserId) {
      fetchConversations();
    }
  }, [currentLoggedInUserId]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser && currentLoggedInUserId) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, currentLoggedInUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Get all users where the current user has sent messages
      const sentResponse = await axios.get(`/api/message/users?senderId=${currentLoggedInUserId}`);
      const receivers = sentResponse.data.receivers || [];
      
      // Get all users where the current user has received messages
      const receivedResponse = await axios.get(`/api/message/users/received?receiverId=${currentLoggedInUserId}`);
      const senders = receivedResponse.data.senders || [];
      
      // Combine and deduplicate users
      const allUsers = [...receivers, ...senders];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u._id === user._id)
      );
      
      if (uniqueUsers.length > 0) {
        setUsers(uniqueUsers);
        setSelectedUser(uniqueUsers[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (receiverId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/message?senderId=${currentLoggedInUserId}&receiverId=${receiverId}`);
      const fetchedMessages = response.data.messages;
      setMessages(fetchedMessages);
      
      // Get property ID from the first message if it exists
      if (fetchedMessages.length > 0 && fetchedMessages[0].propertyId) {
        setPropertyId(fetchedMessages[0].propertyId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentLoggedInUserId) return;
    
    try {
      const messagePayload = {
        senderId: currentLoggedInUserId,
        receiverId: selectedUser._id,
        content: newMessage,
        propertyId: propertyId // Use the property ID from previous messages
      };
      
      // Add optimistic update for better UX
      const optimisticMessage = {
        _id: 'temp-' + Date.now(),
        senderId: currentLoggedInUserId,
        receiverId: selectedUser._id,
        content: newMessage,
        propertyId: propertyId || undefined, // Convert null to undefined
        timestamp: new Date().toISOString()
      };
      
      setMessages([...messages, optimisticMessage]);
      setNewMessage('');
      
      await axios.post('/api/message', messagePayload);
      
      // Refresh messages to confirm the message was sent
      setTimeout(() => {
        fetchMessages(selectedUser._id);
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp: string) => {
    return dayjs(timestamp).format('HH:mm');
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffDays = now.diff(date, 'day');

    if (diffDays === 0) {
      return date.format('HH:mm');
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.format('dddd');
    } else {
      return date.format('MMM D');
    }
  };

  // Find last message for each user
  const getLastMessage = (userId: string) => {
    const userMessages = messages.filter(
      msg => (msg.senderId === userId || msg.receiverId === userId)
    );
    
    return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - User List */}
      <div className={`bg-white shadow-lg ${sidebarOpen ? 'w-full md:w-80' : 'w-0'} md:block transition-all duration-300 overflow-hidden flex-shrink-0 h-full`} style={{ display: sidebarOpen ? 'block' : 'none' }}>
        <div className="p-4 border-b border-gray-200 mt-[78px]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <button onClick={toggleSidebar} className="md:hidden">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="h-full overflow-y-auto">
          {loading && users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => {
                const lastMessage = getLastMessage(user._id);
                
                return (
                  <div 
                    key={user._id} 
                    className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${selectedUser?._id === user._id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full mr-3 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h2 className="text-sm font-medium text-gray-900 truncate">{user.name}</h2>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden mt-[73px]">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="md:hidden mr-4">
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            {selectedUser ? (
              <>
                <div className="w-10 h-10 rounded-full mr-3 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-medium text-gray-900">{selectedUser.name}</h2>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </>
            ) : (
              <div className="font-medium text-gray-900">Select a conversation</div>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading && selectedUser ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length > 0 && selectedUser ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const isSelf = message.senderId === currentLoggedInUserId;
                
                return (
                  <div 
                    key={message._id} 
                    className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isSelf ? 'bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-white text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm'} px-4 py-2`}>
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isSelf ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : selectedUser ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">No messages yet</div>
                <p className="text-gray-500">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">Select a user</div>
                <p className="text-gray-500">Choose a conversation from the sidebar</p>
              </div>
            </div>
          )}
        </div>
        
        {selectedUser && (
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}