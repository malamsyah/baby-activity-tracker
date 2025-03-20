"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import { format, startOfDay, endOfDay, differenceInDays } from 'date-fns';

export default function StatsPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last7days');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredActivities = () => {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case 'last7days':
        startDate = startOfDay(new Date(now.setDate(now.getDate() - 6)));
        break;
      case 'last30days':
        startDate = startOfDay(new Date(now.setDate(now.getDate() - 29)));
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    return activities.filter(activity => new Date(activity.timestamp) >= startDate);
  };

  const filteredActivities = getFilteredActivities();

  const calculateStats = () => {
    const diaperCount = filteredActivities.filter(a => a.type === 'diaper').length;
    const peeCount = filteredActivities.filter(a => a.type === 'diaper' && a.details?.content === 'pee').length;
    const poopCount = filteredActivities.filter(a => a.type === 'diaper' && a.details?.content === 'poop').length;
    
    const feedingCount = filteredActivities.filter(a => a.type === 'feeding').length;
    const breastfeedingCount = filteredActivities.filter(a => 
      a.type === 'feeding' && a.details?.feedingType === 'breast'
    ).length;
    
    // Get average feeds per day
    const days = dateRange === 'today' ? 1 : dateRange === 'last7days' ? 7 : dateRange === 'last30days' ? 30 : 
      differenceInDays(new Date(), new Date(activities[activities.length - 1]?.timestamp)) + 1;
    
    const avgFeedsPerDay = days > 0 ? (feedingCount / days).toFixed(1) : 0;
    
    return {
      totalDiapers: diaperCount,
      peeCount,
      poopCount,
      totalFeedings: feedingCount,
      breastfeedingCount,
      avgFeedsPerDay,
    };
  };

  const stats = calculateStats();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Baby Stats</h1>
          
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="alltime">All Time</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsCard 
              title="Diaper Changes" 
              icon="🧷" 
              stats={[
                { label: 'Total', value: stats.totalDiapers },
                { label: 'Pee', value: stats.peeCount },
                { label: 'Poop', value: stats.poopCount },
              ]}
            />
            
            <StatsCard 
              title="Feedings" 
              icon="🍼" 
              stats={[
                { label: 'Total', value: stats.totalFeedings },
                { label: 'Breastfeeding', value: stats.breastfeedingCount },
                { label: 'Avg Per Day', value: stats.avgFeedsPerDay },
              ]}
            />
          </div>
        )}
      </div>
    </main>
  );
}