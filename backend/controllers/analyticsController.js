import Event from '../models/Event.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

/**
 * ANALYTICS CONTROLLER
 * Generates insights about events, tasks, and student activity
 */

/**
 * GET /api/analytics/dashboard
 * Returns comprehensive analytics data
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    // 1. COUNT TOTAL EVENTS
    const totalEvents = await Event.countDocuments();

    // 2. COUNT TOTAL TASKS
    const totalTasks = await Task.countDocuments();

    // 3. CALCULATE TASK COMPLETION RATE
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 4. GET ACTIVE VS INACTIVE STUDENTS
    // Active = students with at least 1 completed task
    // Inactive = students with 0 completed tasks
    const activeStudents = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'assignedTasks',
        },
      },
      {
        $addFields: {
          completedTasks: {
            $filter: {
              input: '$assignedTasks',
              as: 'task',
              cond: { $eq: ['$$task.status', 'Completed'] },
            },
          },
        },
      },
      {
        $match: {
          completedTasks: { $not: { $size: 0 } },
        },
      },
      { $count: 'count' },
    ]);

    const activeStudentCount = activeStudents.length > 0 ? activeStudents[0].count : 0;

    // Total students
    const totalStudents = await User.countDocuments({ role: 'student' });
    const inactiveStudentCount = totalStudents - activeStudentCount;

    // 5. WEEKLY TASK PERFORMANCE (Last 4 weeks)
    const today = new Date();
    const fourWeeksAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);

    const weeklyPerformance = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: fourWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            // Group by week
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0],
            },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    // Format weekly data for easy consumption
    const formattedWeeklyPerformance = weeklyPerformance.map((item, index) => ({
      week: `Week ${item._id.week}`,
      completed: item.completed,
      pending: item.pending,
      inProgress: item.inProgress,
      total: item.total,
    }));

    // 6. MONTHLY EVENT COUNT (Last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyEvents = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyEvents = monthlyEvents.map((item) => ({
      month: monthNames[item._id.month - 1],
      events: item.count,
    }));

    // 7. TASK STATUS BREAKDOWN
    const taskStatusBreakdown = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format task status
    const formattedTaskStatus = {
      completed: 0,
      pending: 0,
      inProgress: 0,
    };

    taskStatusBreakdown.forEach((item) => {
      if (item._id === 'Completed') formattedTaskStatus.completed = item.count;
      if (item._id === 'Pending') formattedTaskStatus.pending = item.count;
      if (item._id === 'In Progress') formattedTaskStatus.inProgress = item.count;
    });

    // 8. TOP ACTIVITIES (Most assigned activity type)
    const topActivities = await Event.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'event',
          as: 'tasks',
        },
      },
      {
        $addFields: {
          taskCount: { $size: '$tasks' },
        },
      },
      { $sort: { taskCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          taskCount: 1,
          date: 1,
        },
      },
    ]);

    // 9. RECENT ACTIVITIES (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTasks = await Task.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentEvents = await Event.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // 10. STUDENT INTEREST IN EVENTS
    // Track which events students are interested in based on task assignments
    const studentInterestInEvents = await Event.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'event',
          as: 'eventTasks',
        },
      },
      {
        $addFields: {
          interestedStudents: {
            $size: {
              $filter: {
                input: '$eventTasks',
                as: 'task',
                cond: { $ne: ['$$task.assignedTo', null] },
              },
            },
          },
          completedTasksCount: {
            $size: {
              $filter: {
                input: '$eventTasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'Completed'] },
              },
            },
          },
          totalTasksCount: { $size: '$eventTasks' },
        },
      },
      {
        $addFields: {
          completionPercentage: {
            $cond: [
              { $eq: ['$totalTasksCount', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$completedTasksCount', '$totalTasksCount'] }, 100] }] }
            ],
          },
        },
      },
      { $sort: { interestedStudents: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          date: 1,
          location: 1,
          interestedStudents: 1,
          totalTasksCount: 1,
          completedTasksCount: 1,
          completionPercentage: 1,
          activityType: 1,
        },
      },
    ]);

    // Send response
    res.status(200).json({
      success: true,
      data: {
        // Key metrics
        totalEvents,
        totalTasks,
        completionRate,
        activeStudents: activeStudentCount,
        inactiveStudents: inactiveStudentCount,
        totalStudents,

        // Breakdown data
        taskStatusBreakdown: formattedTaskStatus,
        weeklyPerformance: formattedWeeklyPerformance,
        monthlyEvents: formattedMonthlyEvents,
        topActivities,

        // Student Interest in Events
        studentInterestInEvents,

        // Recent activity
        recentTasks,
        recentEvents,
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message,
    });
  }
};

/**
 * GET /api/analytics/summary
 * Returns quick summary metrics
 */
export const getSummaryAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalStudents = await User.countDocuments({ role: 'student' });

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalTasks,
        completionRate,
        totalStudents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching summary analytics',
      error: error.message,
    });
  }
};
