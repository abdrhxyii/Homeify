import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, List, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  propertyId?: string;
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  receiverId: string;
  propertyId: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose, receiverId, propertyId }) => {
  const { currentLoggedInUserId } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && currentLoggedInUserId && receiverId) {
      fetchMessages();
    }
  }, [visible, currentLoggedInUserId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/message?senderId=${currentLoggedInUserId}&receiverId=${receiverId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await axios.post('/api/message', {
        senderId: currentLoggedInUserId,
        receiverId,
        content: newMessage,
        propertyId
      });
      
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal
      title="Chat"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      bodyStyle={{ height: '60vh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1, overflow: 'auto', padding: '0 10px', marginBottom: '10px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => {
              const isCurrentUser = message.senderId === currentLoggedInUserId;
              
              return (
                <List.Item
                  style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    padding: '5px 0'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      backgroundColor: isCurrentUser ? '#1890ff' : '#f0f0f0',
                      color: isCurrentUser ? 'white' : 'black',
                      padding: '10px 15px',
                      borderRadius: '10px',
                      wordBreak: 'break-word'
                    }}
                  >
                    {message.content}
                    <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
                      {dayjs(message.timestamp).format('h:mm A')}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ display: 'flex', marginTop: 'auto' }}>
        <TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSend}
        />
      </div>
    </Modal>
  );
};

export default ChatModal;