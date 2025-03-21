import { v4 as uuidv4 } from 'uuid';
import supabase from './connection';

/**
 * Get all activities ordered by timestamp
 * @returns {Promise<Array>} Array of activities
 */
export async function getAllActivities() {
  const { data, error } = await supabase
    .from('baby_activities')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
  
  // Handle details column - it may already be an object or a string
  return data.map(row => {
    let parsedDetails = null;
    
    if (row.details) {
      // If it's a string, try to parse it, otherwise use it as is
      if (typeof row.details === 'string') {
        try {
          parsedDetails = JSON.parse(row.details);
        } catch (error) {
          console.error(`Error parsing details for activity ${row.id}:`, error);
          parsedDetails = null;
        }
      } else {
        // Already an object
        parsedDetails = row.details;
      }
    }
    
    return {
      ...row,
      details: parsedDetails
    };
  });
}

/**
 * Create a new activity
 * @param {Object} activity - Activity data
 * @param {string} activity.type - Activity type
 * @param {string} activity.timestamp - Activity timestamp
 * @param {Object} activity.details - Activity details
 * @param {string} activity.notes - Activity notes
 * @returns {Promise<string>} New activity ID
 */
export async function createActivity({ type, timestamp, details, notes }) {
  const id = uuidv4();
  
  const { error } = await supabase
    .from('baby_activities')
    .insert({
      id,
      type,
      timestamp,
      details, // Supabase handles JSON objects automatically
      notes
    });
  
  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
  
  return id;
}

/**
 * Delete an activity by ID
 * @param {string} id - Activity ID to delete
 * @returns {Promise<void>}
 */
export async function deleteActivity(id) {
  const { error } = await supabase
    .from('baby_activities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
} 