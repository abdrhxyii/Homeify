import React from 'react';
import { Card } from 'antd';
import { CardData } from '@/types/interfaces';

interface StatCardsProps {
  cards: CardData[];
  loading: boolean;
}

const StatCards: React.FC<StatCardsProps> = ({ cards, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="shadow-xl rounded-lg"
          style={{ backgroundColor: card.color, color: 'white' }}
          bodyStyle={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          loading={loading}
        >
          <div className="flex items-center">
            <div className="mr-4 p-4 rounded-full bg-white" style={{ color: card.iconColor }}>
              {card.icon}
            </div>
            <div>
              <h3 className="text-3xl font-bold">{card.count}</h3>
              <p className="text-sm">{card.title}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;