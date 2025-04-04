import { useState } from 'react';
import Image from 'next/image';
import { Modal, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export default function Hero() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulating AI response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'AI response goes here...', sender: 'ai' }]);
      }, 1000);
    }
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full">
      <div className="absolute inset-0">
        <Image 
          src="/hero.webp" 
          alt="Hero" 
          fill
          objectFit="cover" 
          className="z-0" 
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-15 z-10 flex items-center justify-center">
        <div className="text-center text-white px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Home</h1>
          <p className="text-lg md:text-xl mb-6">Discover the best properties in your desired location</p>
          <div className="max-w-md mx-auto mb-4">
            <input
              type="text"
              placeholder="Enter an address, neighborhood, city"
              className="w-full p-4 rounded-lg text-black placeholder-gray-500"
            />
          </div>
          <Button type="primary" onClick={() => setIsChatOpen(true)}>
            Chat with AI
          </Button>
        </div>
      </div>
      
      <Modal
        title="Chat with AI"
        open={isChatOpen}
        onCancel={() => setIsChatOpen(false)}
        footer={null}
        className="w-full md:w-1/2 mx-auto"
      >
        <div className="h-96 overflow-y-auto p-4 bg-gray-100 rounded-lg">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about system data..."
            onPressEnter={handleSend}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
        </div>
      </Modal>
    </section>
  );
}