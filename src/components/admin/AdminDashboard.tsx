import React, { useEffect, useState } from 'react';
import { Card, Button, DatePicker, Table, Popconfirm, message, Radio, RadioChangeEvent } from "antd";
import { User, Home, DollarSign, TrendingUp } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import axios from 'axios';
import { CardData, UserData, DashboardStats } from '@/types/interfaces';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCards from './AdminDashboardSubComponents/StatCards';
import UserManagement from './AdminDashboardSubComponents/UserManagement';
import SubscriptionDistribution from './AdminDashboardSubComponents/SubscriptionDistribution';
import TopLister from './AdminDashboardSubComponents/TopLister';
import ReportGenerator from './AdminDashboardSubComponents/ReportGenerator';

dayjs.extend(weekOfYear);

// Interface for user growth data
interface UserGrowthData {
  date: string;
  count: number;
}

// Type for Period Selection
type PeriodType = 'daily' | 'weekly' | 'monthly';

interface AdminDashboardProps {
  loading: boolean;
  onError: (message: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ loading: initialLoading, onError }) => {
  const [loading, setLoading] = useState(initialLoading);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [userGrowthPeriod, setUserGrowthPeriod] = useState<PeriodType>('monthly');
  const [userGrowthLoading, setUserGrowthLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const overviewResponse = await axios.get('/api/dashboard/admin/overview');
      setStats(overviewResponse.data);
      
      const usersResponse = await axios.get('/api/dashboard/admin/users');
      const formattedUsers = usersResponse.data.data.map((user: any) => ({
        key: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        paymentStatus: user.subscription?.plan && user.subscription?.status === 'active' ? 'Paid' : 'Free',
        role: user.role,
        createdAt: user.createdAt
      }));
      setUsers(formattedUsers);
      
      // Process user growth data after fetching users
      processUserGrowthData(formattedUsers, userGrowthPeriod);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      onError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Process user data to get growth trends
  const processUserGrowthData = (userData: UserData[], period: PeriodType) => {
    setUserGrowthLoading(true);
    
    try {
      if (!userData || userData.length === 0) {
        setUserGrowthData([]);
        return;
      }
      
      // Sort users by creation date
      const sortedUsers = [...userData].sort((a: any, b: any) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      // Get the first and last user creation dates
      const firstUserDate = dayjs(sortedUsers[0].createdAt);
      const lastUserDate = dayjs(sortedUsers[sortedUsers.length - 1].createdAt);
      
      // Create data points based on selected period
      const growthData: UserGrowthData[] = [];
      let currentDate = firstUserDate.clone();
      const endDate = lastUserDate.clone();
      
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        let nextDate;
        let dateFormat;
        let groupDate;
        
        if (period === 'daily') {
          nextDate = currentDate.add(1, 'day');
          dateFormat = 'YYYY-MM-DD';
          groupDate = currentDate.format('MMM DD');
        } else if (period === 'weekly') {
          nextDate = currentDate.add(1, 'week');
          dateFormat = 'YYYY-[W]WW';
          groupDate = `Week ${currentDate.week()}, ${currentDate.format('YYYY')}`;
        } else { // monthly
          nextDate = currentDate.add(1, 'month');
          dateFormat = 'YYYY-MM';
          groupDate = currentDate.format('MMM YYYY');
        }
        
        // Count users created in this period
        const usersInPeriod = sortedUsers.filter((user: any) => {
          const userCreatedAt = dayjs(user.createdAt);
          return userCreatedAt.isAfter(currentDate) && userCreatedAt.isBefore(nextDate);
        }).length;
        
        growthData.push({
          date: groupDate,
          count: usersInPeriod
        });
        
        currentDate = nextDate;
      }
      
      setUserGrowthData(growthData);
    } catch (error) {
      console.error("Error processing user growth data:", error);
      onError("Failed to process user growth data");
    } finally {
      setUserGrowthLoading(false);
    }
  };

  // Handle period change
  const handlePeriodChange = (e: RadioChangeEvent) => {
    const period = e.target.value as PeriodType;
    setUserGrowthPeriod(period);
    processUserGrowthData(users, period);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete('/api/dashboard/admin/users', {
        data: { userId: id }
      });
      message.success("User deleted successfully");
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      onError("Failed to delete user");
    }
  };

  const generateCards = () => {
    if (stats) {
      const cardData: CardData[] = [
        {
          title: "Total Users",
          count: stats.totalUsers,
          icon: <User size={32} />,
          color: "#6B73FF",
          iconColor: "#6B73FF",
        },
        {
          title: "Paid Users",
          count: stats.paidUsers,
          icon: <User size={32} />,
          color: "#FF8C00",
          iconColor: "#FF8C00",
        },
        {
          title: "Property Listings",
          count: stats.totalProperties,
          icon: <Home size={32} />,
          color: "#33C6A4",
          iconColor: "#33C6A4",
        },
        {
          title: "Total Revenue",
          count: `$${stats.totalRevenue.toLocaleString()}`,
          icon: <DollarSign size={32} />,
          color: "#4CAF50",
          iconColor: "#4CAF50",
        }
      ];
      return cardData;
    } else {
      return [];
    }
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  return (
    <>
      <StatCards cards={generateCards()} loading={loading} />

      <div className="mt-8">
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="mr-2" size={20} />
                <span className="text-xl font-semibold">User Growth Trends</span>
              </div>
              <Radio.Group 
                value={userGrowthPeriod} 
                onChange={handlePeriodChange}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="daily">Daily</Radio.Button>
                <Radio.Button value="weekly">Weekly</Radio.Button>
                <Radio.Button value="monthly">Monthly</Radio.Button>
              </Radio.Group>
            </div>
          }
          loading={userGrowthLoading}
          className="shadow-md"
        >
          <div style={{ width: '100%', height: 350 }}>
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart
                  data={userGrowthData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    name="New Users"
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="New Users"
                    stroke="#6B73FF"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No user growth data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ReportGenerator
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        users={users}
        stats={stats}
        userGrowthData={userGrowthData}
      />

      <div className="mt-8">
        <UserManagement 
          users={users} 
          loading={loading} 
          onDeleteUser={handleDeleteUser} 
        />
      </div>

      {stats && (
        <SubscriptionDistribution 
          distribution={stats.subscriptionDistribution} 
        />
      )}

      {stats && stats.bestLister && stats.bestLister.name !== "N/A" && (
        <TopLister bestLister={stats.bestLister} />
      )}
    </>
  );
};

export default AdminDashboard;