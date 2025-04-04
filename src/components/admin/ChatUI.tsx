import { useState } from "react";
import { Avatar, List, Modal, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
}

interface Message {
  sender: "me" | "them";
  text: string;
}

const users: User[] = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1", lastMessage: "Hey, how are you?" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2", lastMessage: "See you tomorrow!" },
];

export default function ChatUI() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const openChat = (user: User) => {
    setSelectedUser(user);
    setMessages([
      { sender: "them", text: user.lastMessage },
      { sender: "me", text: "Sure! See you then." },
    ]);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    setMessages([...messages, { sender: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="flex h-auto bg-gray-100 p-4">
      {/* Sidebar */}
      <div className="w-full bg-white rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Chats</h2>
        <List
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              onClick={() => openChat(user)}
              className="cursor-pointer hover:bg-gray-200 p-3 rounded-lg transition duration-200"
            >
              <List.Item.Meta
                avatar={<Avatar src={user.avatar} />}
                title={<span className="font-medium text-gray-800">{user.name}</span>}
                description={<span className="text-gray-500">{user.lastMessage}</span>}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Chat Modal */}
      <Modal
        title={
          selectedUser && (
            <div className="flex items-center space-x-3">
              <Avatar src={selectedUser.avatar} />
              <span className="text-lg font-semibold text-gray-800">{selectedUser.name}</span>
            </div>
          )
        }
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        footer={null}
        centered
        className="rounded-lg"
      >
        {/* Chat Messages */}
        <div className="h-auto overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-inner space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-center space-x-2">
                {msg.sender !== "me" && (
                  <Avatar src={selectedUser?.avatar} size={32} />
                )}
                <div
                  className={`px-4 py-2 rounded-2xl shadow-md max-w-xs ${
                    msg.sender === "me"
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="mt-4 flex items-center bg-white p-3 rounded-lg shadow-md">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring focus:ring-blue-300"
          />
          <Button
            type="primary"
            className="ml-2 flex items-center px-4 py-2 text-lg"
            icon={<SendOutlined />}
            onClick={sendMessage}
          >
            Send
          </Button>
        </div>
      </Modal>
    </div>
  );
}
