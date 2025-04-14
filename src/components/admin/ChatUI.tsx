import React, { useState } from 'react';

const users = [
    { id: 1, name: 'User 1', avatar: 'https://i.pravatar.cc/40?img=1' },
    { id: 2, name: 'User 2', avatar: 'https://i.pravatar.cc/40?img=2' },
    { id: 3, name: 'User 3', avatar: 'https://i.pravatar.cc/40?img=3' },
];

const ChatUI: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [messages, setMessages] = useState([
        { user: 'assistant', text: 'Hello! How can I help you today?' },
        { user: 'user', text: 'I need assistance with my order.' },
        { user: 'assistant', text: 'Sure! Can you provide me with your order number?' },
        { user: 'user', text: 'It\'s 12345.' },
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
        // Here you can load the user's specific messages if needed
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { user: 'user', text: inputValue }]);
            setInputValue(''); // Clear the input field after sending
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
            <div className="w-full md:w-1/4 border-b md:border-r border-gray-300 p-4 md:border-b-0">
                <h2 className="text-lg font-semibold mb-4">Users</h2>
                <ul>
                    {users.map(user => (
                        <li
                            key={user.id}
                            className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleUserClick(user)}
                        >
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                            <span>{user.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col space-y-4">
                        {/* Display messages for the selected user */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start ${msg.user === 'user' ? 'justify-end' : ''}`}>
                                <div className={`p-2 rounded-lg max-w-xs ${msg.user === 'user' ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t border-gray-300 flex items-center sticky bottom-0 bg-gray-100">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;
