
import React, { useState, useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Calendar, Download, Info, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalyticsScreenProps {
  onNavigate: (screen: string) => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const reportRef = useRef<HTMLDivElement>(null);

  // Generate current date ranges
  const dateRanges = useMemo(() => {
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)

    const ranges = [];

    // Current week
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    ranges.push(`${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);

    // Previous weeks
    for (let i = 1; i < 4; i++) {
      const start = new Date(currentWeekStart);
      start.setDate(currentWeekStart.getDate() - (i * 7));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      ranges.push(`${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    }

    return ranges;
  }, []);

  const [dateRangeIndex, setDateRangeIndex] = useState(0);
  const dateRange = dateRanges[dateRangeIndex];

  const dataSets = useMemo(() => {
    // Generate different data based on date range index
    const baseValues = [0.12, 0.15, 0.21, 0.09, 0.11, 0.08, 0.07];
    const variations = [0, 0.02, -0.01, 0.03, -0.02, 0.01, 0.04]; // Different variations for each date range

    return {
      Daily: [
        { day: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), val: baseValues[dateRangeIndex] || 0.12 }
      ],
      Weekly: [
        { day: 'Mon', val: baseValues[0] + (variations[dateRangeIndex] || 0) },
        { day: 'Tue', val: baseValues[1] + (variations[dateRangeIndex] || 0) },
        { day: 'Wed', val: baseValues[2] + (variations[dateRangeIndex] || 0) },
        { day: 'Thu', val: baseValues[3] + (variations[dateRangeIndex] || 0) },
        { day: 'Fri', val: baseValues[4] + (variations[dateRangeIndex] || 0) },
        { day: 'Sat', val: baseValues[5] + (variations[dateRangeIndex] || 0) },
        { day: 'Sun', val: baseValues[6] + (variations[dateRangeIndex] || 0) }
      ],
      Monthly: [
        { day: 'Week 1', val: 0.14 + (variations[dateRangeIndex] * 0.5 || 0) },
        { day: 'Week 2', val: 0.16 + (variations[dateRangeIndex] * 0.3 || 0) },
        { day: 'Week 3', val: 0.11 + (variations[dateRangeIndex] * 0.7 || 0) },
        { day: 'Week 4', val: 0.09 + (variations[dateRangeIndex] * 0.2 || 0) }
      ],
      Quarterly: [
        { day: 'Jan-Mar', val: 0.13 + (variations[dateRangeIndex] * 0.4 || 0) },
        { day: 'Apr-Jun', val: 0.15 + (variations[dateRangeIndex] * 0.6 || 0) },
        { day: 'Jul-Sep', val: 0.10 + (variations[dateRangeIndex] * 0.1 || 0) },
        { day: 'Oct-Dec', val: 0.08 + (variations[dateRangeIndex] * 0.8 || 0) }
      ]
    };
  }, [dateRangeIndex]);

  const currentData = dataSets[selectedPeriod as keyof typeof dataSets];

  const sourceData = [
    { name: 'Ambient', value: 45, color: '#6366f1' },
    { name: 'Mobile Devices', value: 30, color: '#fbbf24' },
    { name: 'High Volt', value: 25, color: '#f87171' }
  ];

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add title page
      pdf.setFontSize(24);
      pdf.text('Radiation Analytics Report', 20, 30);
      pdf.setFontSize(14);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
      pdf.text(`Period: ${selectedPeriod} - ${dateRange}`, 20, 65);

      // Summary Statistics
      pdf.setFontSize(18);
      pdf.text('Summary Statistics', 20, 90);
      pdf.setFontSize(12);
      const avgExposure = currentData.reduce((sum, item) => sum + item.val, 0) / currentData.length;
      const maxExposure = Math.max(...currentData.map(d => d.val));
      const minExposure = Math.min(...currentData.map(d => d.val));
      pdf.text(`Average Exposure: ${avgExposure.toFixed(3)} µSv/h`, 20, 110);
      pdf.text(`Maximum Exposure: ${maxExposure.toFixed(3)} µSv/h`, 20, 125);
      pdf.text(`Minimum Exposure: ${minExposure.toFixed(3)} µSv/h`, 20, 140);
      pdf.text(`Data Points: ${currentData.length}`, 20, 155);
      pdf.text(`Report Period: ${dateRange}`, 20, 170);

      // Source Distribution Table
      pdf.setFontSize(18);
      pdf.text('Source Distribution', 20, 195);
      pdf.setFontSize(12);
      let yPos = 215;
      sourceData.forEach(source => {
        pdf.text(`${source.name}: ${source.value}%`, 20, yPos);
        yPos += 15;
      });

      // Add new page for charts
      pdf.addPage();

      // Add the captured image
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight > pageHeight ? pageHeight : imgHeight);

      // If image is taller, add more pages
      if (imgHeight > pageHeight) {
        heightLeft = imgHeight - pageHeight;
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, - (imgHeight - heightLeft), imgWidth, imgHeight > pageHeight ? pageHeight : heightLeft);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`radiation-analytics-${selectedPeriod.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  return (
    <div className="p-6" ref={reportRef}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <button
          onClick={generatePDF}
          className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <Download size={20} />
        </button>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedPeriod(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              tab === selectedPeriod ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Average Exposure</h3>
          <button
            onClick={() => {
              setDateRangeIndex((prev) => (prev + 1) % dateRanges.length);
            }}
            className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Calendar size={14} className="mr-1" />
            {dateRange}
          </button>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 500 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.val > 0.2 ? '#f87171' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 self-start">Source Distribution</h4>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 w-full mt-2">
            {sourceData.map(s => (
              <div key={s.name} className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500">{s.name}</span>
                <span className="text-[10px] font-bold text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-3xl p-5 text-white flex flex-col justify-between">
          <Info size={24} className="text-indigo-400" />
          <div>
            <p className="text-xs text-indigo-300 font-medium leading-relaxed">
              Your average exposure is 12% lower than last week.
            </p>
            <div className="mt-4 flex items-baseline space-x-1">
              <span className="text-2xl font-black">-12%</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase">Improvement</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Related Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('ml')}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Info size={20} />
              </div>
              <span className="text-sm font-bold text-slate-800">ML Predictions</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button
            onClick={() => onNavigate('recommendations')}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Calendar size={20} />
              </div>
              <span className="text-sm font-bold text-slate-800">Recommendations</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
