import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

export default function ActivityCard({ activity, onActivityUpdated }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/activities/${activity.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete activity');
        onActivityUpdated();
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getActivityIcon = () => {
    switch (activity.type) {
      case 'diaper':
        return activity.details?.content === 'pee' 
          ? '💧' 
          : activity.details?.content === 'poop' 
            ? '💩' 
            : '🧷';
      case 'feeding':
        return '🍼';
      case 'sleep':
        return '💤';
      default:
        return '📝';
    }
  };

  const getActivityDetails = () => {
    switch (activity.type) {
      case 'diaper':
        return `Diaper change - ${activity.details?.content || 'Changed'}`;
      case 'feeding':
        if (activity.details?.feedingType === 'breast') {
          const duration = activity.details.endTime 
            ? calculateDuration(activity.details.startTime, activity.details.endTime)
            : 'In progress';
          return `Breastfeeding - ${activity.details?.side || ''} (${duration})`;
        }
        return `Feeding - ${activity.details?.feedingType || 'Fed'}`;
      case 'sleep':
        const duration = activity.details?.endTime 
          ? calculateDuration(activity.details.startTime, activity.details.endTime)
          : 'In progress';
        return `Sleep - ${duration}`;
      default:
        return 'Activity logged';
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMinutes = Math.round((endTime - startTime) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{getActivityIcon()}</div>
          <div>
            <h3 className="font-medium text-gray-800">{getActivityDetails()}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(activity.timestamp), 'MMM d, h:mm a')} 
              {' • '} 
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
            {activity.notes && (
              <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
            )}
          </div>
        </div>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-500"
        >
          {isDeleting ? (
            <span className="block w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}