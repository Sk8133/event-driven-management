import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  Zap,
  ActivitySquare,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import AnalyticsCard from '../components/AnalyticsCard';
import api from '../services/api';

/**
 * ANALYTICS DASHBOARD PAGE
 * Comprehensive analytics and insights for events and tasks
 */
const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/analytics/dashboard');
      setAnalyticsData(response.data.data);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Analytics Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-900 text-white min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 shadow-lg">
            <h1 className="text-4xl font-extrabold mb-2">Analytics Dashboard</h1>
            <p className="text-blue-100">Loading your insights...</p>
          </div>
          <div className="px-8 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gray-800 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex bg-gray-900 text-white min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 shadow-lg">
            <h1 className="text-4xl font-extrabold mb-2">Analytics Dashboard</h1>
          </div>
          <div className="px-8 py-12 text-center">
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg inline-block">
              <p>Unable to load analytics data. {error}</p>
              <button
                onClick={fetchAnalyticsData}
                className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Colors for pie chart
  const PIE_COLORS = ['#10b981', '#ef4444'];

  // Prepare data for charts
  const weeklyData = analyticsData.weeklyPerformance || [];
  const monthlyData = analyticsData.monthlyEvents || [];
  const studentData = [
    { name: 'Active', value: analyticsData.activeStudents || 0 },
    { name: 'Inactive', value: analyticsData.inactiveStudents || 0 },
  ];

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 shadow-lg">
          <h1 className="text-4xl font-extrabold mb-2">Analytics Dashboard</h1>
          <p className="text-blue-100 text-lg">Comprehensive insights about events, tasks, and student activity</p>
        </div>

        {/* Content */}
        <div className="px-8 py-12 space-y-12">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* KEY METRICS SECTION */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Total Events"
                value={analyticsData.totalEvents}
                icon={Calendar}
                color="blue"
                isLoading={loading}
              />
              <AnalyticsCard
                title="Total Tasks"
                value={analyticsData.totalTasks}
                icon={ActivitySquare}
                color="purple"
                isLoading={loading}
              />
              <AnalyticsCard
                title="Completion Rate"
                value={`${analyticsData.completionRate}%`}
                icon={CheckCircle2}
                color="green"
                subtext={`${analyticsData.taskStatusBreakdown?.completed || 0} completed`}
                isLoading={loading}
              />
              <AnalyticsCard
                title="Active Students"
                value={analyticsData.activeStudents}
                icon={Users}
                color="indigo"
                subtext={`out of ${analyticsData.totalStudents}`}
                isLoading={loading}
              />
            </div>
          </section>

          {/* TASK STATUS BREAKDOWN */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ActivitySquare className="w-6 h-6 text-orange-400" />
              Task Status Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-lg p-6">
                <p className="text-green-300 text-sm font-semibold uppercase">Completed</p>
                <p className="text-3xl font-bold text-white mt-2">{analyticsData.taskStatusBreakdown?.completed || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
                <p className="text-yellow-300 text-sm font-semibold uppercase">In Progress</p>
                <p className="text-3xl font-bold text-white mt-2">{analyticsData.taskStatusBreakdown?.inProgress || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 rounded-lg p-6">
                <p className="text-red-300 text-sm font-semibold uppercase">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">{analyticsData.taskStatusBreakdown?.pending || 0}</p>
              </div>
            </div>
          </section>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Task Performance */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Weekly Task Performance
              </h3>
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="week" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #444',
                        borderRadius: '8px',
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="pending" fill="#ef4444" name="Pending" />
                    <Bar dataKey="inProgress" fill="#f59e0b" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-8">No task data available</p>
              )}
            </section>

            {/* Monthly Events */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Monthly Events
              </h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #444',
                        borderRadius: '8px',
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="#6366f1"
                      dot={{ fill: '#6366f1' }}
                      name="Events Created"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-8">No event data available</p>
              )}
            </section>

            {/* Student Activity */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Student Activity Status
              </h3>
              {studentData[0].value > 0 || studentData[1].value > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={studentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #444',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-center py-8">No student data available</p>
              )}
            </section>

            {/* Recent Activity */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Recent Activity (Last 7 Days)
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Tasks Created</span>
                  <span className="text-2xl font-bold text-white">{analyticsData.recentTasks || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Events Created</span>
                  <span className="text-2xl font-bold text-white">{analyticsData.recentEvents || 0}</span>
                </div>
              </div>
            </section>
          </div>

          {/* TOP ACTIVITIES */}
          {analyticsData.topActivities && analyticsData.topActivities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Most Active Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyticsData.topActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{activity.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {activity.taskCount} tasks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STUDENT INTEREST IN EVENTS */}
          {analyticsData.studentInterestInEvents && analyticsData.studentInterestInEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6 text-cyan-400" />
                Student Interest in Events
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                      <th className="px-6 py-4 font-semibold text-gray-300">Event Title</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-center">Interested Students</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-center">Total Tasks</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-center">Completed Tasks</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-center">Completion Rate</th>
                      <th className="px-6 py-4 font-semibold text-gray-300 text-center">Activity Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.studentInterestInEvents.map((event, index) => (
                      <tr
                        key={event._id}
                        className={`border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/20'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">{event.title}</span>
                            {event.date && (
                              <span className="text-xs text-gray-400 mt-1">
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full font-semibold">
                            {event.interestedStudents}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-300">
                          {event.totalTasksCount}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-green-400 font-medium">
                            {event.completedTasksCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all"
                                style={{ width: `${event.completionPercentage}%` }}
                              />
                            </div>
                            <span className="text-gray-300 font-semibold min-w-fit">
                              {event.completionPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="capitalize text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded">
                            {event.activityType || 'Other'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {analyticsData.studentInterestInEvents.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No events with student interest yet
                </div>
              )}
            </section>
          )}

          {/* REFRESH BUTTON */}
          <div className="text-center">
            <button
              onClick={fetchAnalyticsData}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Refresh Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
