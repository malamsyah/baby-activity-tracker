"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';
import { formatDistanceToNow } from 'date-fns';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    fetchActivities();
  }, [router]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeFilter);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Activity Log</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Activity
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button 
            onClick={() => handleFilterChange('all')} 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => handleFilterChange('diaper')} 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'diaper' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Diaper
          </button>
          <button 
            onClick={() => handleFilterChange('feeding')} 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'feeding' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Feeding
          </button>
          <button 
            onClick={() => handleFilterChange('sleep')} 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeFilter === 'sleep' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Sleep
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onActivityUpdated={fetchActivities} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No activities recorded yet.
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <AddActivityModal 
          onClose={() => setShowModal(false)} 
          onActivityAdded={fetchActivities}
        />
      )}
    </main>
  );
}