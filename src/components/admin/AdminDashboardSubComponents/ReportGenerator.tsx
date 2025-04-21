// components/ReportGenerator.tsx
import React from 'react';
import { DatePicker, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import { FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // default import
import { UserData, DashboardStats } from '@/types/interfaces';

interface ReportGeneratorProps {
  dateRange: [Dayjs, Dayjs];
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  users: UserData[];
  stats: DashboardStats | null;
  userGrowthData: Array<{ date: string; count: number }>;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  dateRange,
  onDateRangeChange,
  users,
  stats,
  userGrowthData
}) => {
  const generateReport = () => {
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');

    // Filter data based on date range
    const filteredUsers = users.filter(user => {
      const createdAt = user?.createdAt;
      return (
        createdAt &&
        new Date(createdAt) >= dateRange[0].toDate() &&
        new Date(createdAt) <= dateRange[1].toDate()
      );
    });

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add report title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Admin Dashboard Report', pageWidth / 2, 20, { align: 'center' });

    // Add date range
    doc.setFontSize(12);
    doc.text(`Report Period: ${startDate} to ${endDate}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

    // Add key stats section
    doc.setFontSize(16);
    doc.text('Key Statistics', 14, 50);

    if (stats) {
      doc.setFontSize(12);
      doc.text(`Total Users: ${stats.totalUsers}`, 20, 60);
      doc.text(`Paid Users: ${stats.paidUsers}`, 20, 66);
      doc.text(`Property Listings: ${stats.totalProperties}`, 20, 72);
      doc.text(`Total Revenue: $${stats.totalRevenue.toLocaleString()}`, 20, 78);

      // Add subscription distribution
      doc.setFontSize(16);
      doc.text('Subscription Distribution', 14, 95);

      doc.setFontSize(12);
      doc.text(`Basic: ${stats.subscriptionDistribution.Basic}`, 20, 105);
      doc.text(`Pro: ${stats.subscriptionDistribution.Pro}`, 20, 111);
      doc.text(`Premium: ${stats.subscriptionDistribution.Premium}`, 20, 117);
    }

    // Add user growth section
    if (userGrowthData.length > 0) {
      doc.setFontSize(16);
      doc.text('User Growth Trends', 14, 135);

      const filteredGrowthData = userGrowthData.slice(0, 8); // Limit to first 8 entries

      // Create table for growth data
      const growthTableData = filteredGrowthData.map(item => [item.date, item.count.toString()]);

      autoTable(doc, {
        startY: 140,
        head: [['Period', 'New Users']],
        body: growthTableData,
        theme: 'grid',
        headStyles: { fillColor: [107, 115, 255] }
      });
    }

    // Add new users section on a new page
    doc.addPage();
    doc.setFontSize(16);
    doc.text('New Users During Selected Period', 14, 20);

    // Create table for user data
    const userData = filteredUsers.map(user => [
      user.name,
      user.email,
      user.paymentStatus,
      user.role,
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'Payment Status', 'Role', 'Joined Date']],
      body: userData as string[][],
      theme: 'striped',
      headStyles: { fillColor: [107, 115, 255] },
      styles: { overflow: 'linebreak' },
      columnStyles: { 1: { cellWidth: 'auto' } }
    });

    // If there's a top lister, include their info
    if (stats && stats.bestLister && stats.bestLister.name !== 'N/A') {
      // @ts-ignore: lastAutoTable is a property added by jspdf-autotable plugin
      const yPos = (doc as any).lastAutoTable.finalY + 20;

      doc.setFontSize(16);
      doc.text('Top Property Lister', 14, yPos);

      doc.setFontSize(12);
      doc.text(`Name: ${stats.bestLister.name}`, 20, yPos + 10);
      doc.text(`Email: ${stats.bestLister.email}`, 20, yPos + 16);
      doc.text(`Properties Listed: ${stats.bestLister.propertyCount}`, 20, yPos + 22);
    }

    // Save and download the PDF
    doc.save(`admin-report-${startDate}-to-${endDate}.pdf`);
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-md shadow-md">
      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        <div className="flex items-center">
          <FileText className="mr-2 text-blue-500" size={20} />
          <span className="text-lg font-semibold">Generate Report</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Select date range for the report</p>
        <DatePicker.RangePicker
          value={[dateRange[0], dateRange[1]]}
          onChange={onDateRangeChange}
          format="YYYY-MM-DD"
          className="w-full sm:w-64 mt-2"
        />
      </div>
      <div>
        <Button
          type="primary"
          size="large"
          onClick={generateReport}
          icon={<FileText size={16} />}
        >
          Generate PDF Report
        </Button>
      </div>
    </div>
  );
};

export default ReportGenerator;
