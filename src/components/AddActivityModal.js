import { useState } from 'react';
import moment from 'moment';

export default function AddActivityModal({ onClose, onActivityAdded }) {
  const [activityType, setActivityType] = useState('diaper');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Diaper fields
    diaperContent: 'pee',
    
    // Feeding fields
    feedingType: 'breast',
    feedingSide: 'left',
    feedingStartTime: (() => {
      // Use moment.js to get current time in local timezone
      return moment().format('YYYY-MM-DDTHH:mm');
    })(),
    feedingEndTime: (() => {
      // Use moment.js to add 10 minutes to current time in local timezone
      return moment().add(10, 'minutes').format('YYYY-MM-DDTHH:mm');
    })(),
    
    // Common fields
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let details = {};
      
      // Format details based on activity type
      if (activityType === 'diaper') {
        details = { content: formData.diaperContent };
      } else if (activityType === 'feeding') {
        details = { 
          feedingType: formData.feedingType,
          side: formData.feedingType === 'breast' ? formData.feedingSide : null,
          startTime: formData.feedingType === 'breast' ? formData.feedingStartTime : null,
          endTime: formData.feedingType === 'breast' && formData.feedingEndTime ? formData.feedingEndTime : null,
        };
      }

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activityType,
          timestamp: moment().toISOString(),
          details,
          notes: formData.notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to add activity');
      onActivityAdded();
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Add Activity</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Activity Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActivityType('diaper')}
                  className={`py-2 px-4 rounded-md flex flex-col items-center ${
                    activityType === 'diaper' 
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                  }`}
                >
                  <span className="text-2xl mb-1">🧷</span>
                  <span className="text-sm">Diaper</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setActivityType('feeding')}
                  className={`py-2 px-4 rounded-md flex flex-col items-center ${
                    activityType === 'feeding' 
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                  }`}
                >
                  <span className="text-2xl mb-1">🍼</span>
                  <span className="text-sm">Feeding</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setActivityType('sleep')}
                  className={`py-2 px-4 rounded-md flex flex-col items-center ${
                    activityType === 'sleep' 
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                  }`}
                >
                  <span className="text-2xl mb-1">💤</span>
                  <span className="text-sm">Sleep</span>
                </button>
              </div>
            </div>

            {/* Conditional fields based on activity type */}
            {activityType === 'diaper' && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Diaper Content</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, diaperContent: 'pee' }))}
                    className={`py-2 px-4 rounded-md flex items-center justify-center ${
                      formData.diaperContent === 'pee' 
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' 
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                    }`}
                  >
                    <span className="text-lg mr-2">💧</span>
                    <span>Pee</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, diaperContent: 'poop' }))}
                    className={`py-2 px-4 rounded-md flex items-center justify-center ${
                      formData.diaperContent === 'poop' 
                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' 
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                    }`}
                  >
                    <span className="text-lg mr-2">💩</span>
                    <span>Poop</span>
                  </button>
                </div>
              </div>
            )}

            {activityType === 'feeding' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Feeding Type</label>
                  <select
                    name="feedingType"
                    value={formData.feedingType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="breast">Breastfeeding</option>
                    <option value="bottle">Bottle</option>
                    <option value="solid">Solid Food</option>
                  </select>
                </div>

                {formData.feedingType === 'breast' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Side</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, feedingSide: 'left' }))}
                          className={`py-2 px-4 rounded-md ${
                            formData.feedingSide === 'left' 
                              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                              : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                          }`}
                        >
                          Left
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, feedingSide: 'right' }))}
                          className={`py-2 px-4 rounded-md ${
                            formData.feedingSide === 'right' 
                              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' 
                              : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                          }`}
                        >
                          Right
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        name="feedingStartTime"
                        value={formData.feedingStartTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">End Time (optional)</label>
                      <input
                        type="datetime-local"
                        name="feedingEndTime"
                        value={formData.feedingEndTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="2"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : 'Save Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}