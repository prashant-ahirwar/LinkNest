import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/analytics/overview');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card max-w-5xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const deviceData = {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [
      {
        data: [
          analytics.deviceBreakdown.mobile,
          analytics.deviceBreakdown.desktop,
          analytics.deviceBreakdown.tablet,
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      },
    ],
  };

  const viewsData = {
    labels: analytics.viewsOverTime.map((v) => v._id),
    datasets: [
      {
        label: 'Page Views',
        data: analytics.viewsOverTime.map((v) => v.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalViews}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalClicks}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Click Rate</h3>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.totalViews > 0
              ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <Doughnut data={deviceData} options={{ maintainAspectRatio: true }} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Views (Last 30 Days)
          </h3>
          <Line
            data={viewsData}
            options={{
              maintainAspectRatio: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>

      {/* Link Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Link Performance</h3>
        <div className="space-y-3">
          {analytics.linkStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No links yet</p>
          ) : (
            analytics.linkStats.map((link) => (
              <div
                key={link._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{link.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{link.clickCount}</p>
                  <p className="text-xs text-gray-500">clicks</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
