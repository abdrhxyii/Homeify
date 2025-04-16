import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Message } from '@/types/interfaces';
import dayjs from 'dayjs';

const ChatUI: React.FC = () => {
    const { currentLoggedInUserId } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
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
            
            // First get all users where you've sent messages
            const sentResponse = await axios.get(`/api/message/users?senderId=${currentLoggedInUserId}`);
            const sendersList = sentResponse.data.receivers || [];
            
            // Then get all users where you've received messages
            // We need to modify the API endpoint for this
            const receivedResponse = await axios.get(`/api/message/users/received?receiverId=${currentLoggedInUserId}`);
            const receiversList = receivedResponse.data.senders || [];
            
            // Combine and deduplicate users
            const allUsers = [...sendersList, ...receiversList];
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

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        // Messages will be fetched via useEffect when selectedUser changes
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedUser || !currentLoggedInUserId) return;
        
        try {
            const messagePayload = {
                senderId: currentLoggedInUserId,
                receiverId: selectedUser._id,
                content: inputValue,
                propertyId: propertyId || '', // Use an empty string if propertyId is null
            };
            
            await axios.post('/api/message', messagePayload);
            
            // Add optimistic update for better UX
            const newMessage = {
                _id: 'temp-' + Date.now(),
                senderId: currentLoggedInUserId,
                receiverId: selectedUser._id,
                content: inputValue,
                propertyId: propertyId || '', // Use an empty string if propertyId is null
                timestamp: new Date().toISOString()
            };
            
            setMessages([...messages, newMessage]);
            setInputValue(''); // Clear the input field after sending
            
            // Then refresh messages from server for confirmation
            setTimeout(() => {
                fetchMessages(selectedUser._id);
            }, 500);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatMessageTime = (timestamp: string) => {
        return dayjs(timestamp).format('HH:mm');
    };

    // Handle Enter key press for sending messages
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
            <div className="w-full md:w-1/4 border-b md:border-r border-gray-300 p-4 md:border-b-0">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                {loading && users.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : users.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No conversations yet</div>
                ) : (
                    <ul>
                        {users.map(user => (
                            <li
                                key={user._id}
                                className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 ${selectedUser?._id === user._id ? 'bg-blue-100' : ''}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span>{user.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex-1 flex flex-col">
                {selectedUser && (
                    <div className="p-3 bg-white border-b border-gray-300">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                {selectedUser.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{selectedUser.name}</span>
                        </div>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading && selectedUser ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-500">Loading messages...</div>
                        </div>
                    ) : messages.length > 0 && selectedUser ? (
                        <div className="flex flex-col space-y-4">
                            {messages.map((message, index) => {
                                const isSelf = message.senderId === currentLoggedInUserId;
                                
                                return (
                                    <div key={message._id} className={`flex items-start ${isSelf ? 'justify-end' : ''}`}>
                                        <div className={`p-3 rounded-lg max-w-xs ${isSelf ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
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
                <div className="p-4 border-t border-gray-300 flex items-center sticky bottom-0 bg-gray-100">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!selectedUser}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                        disabled={!selectedUser}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;