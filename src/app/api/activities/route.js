import { NextResponse } from 'next/server';
import { activities } from '@/lib/db';

export async function GET() {
  try {
    const activitiesList = await activities.getAllActivities();
    return NextResponse.json(activitiesList);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const activityData = await request.json();
    const id = await activities.createActivity(activityData);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error adding activity:', error);
    return NextResponse.json(
      { error: 'Failed to add activity' },
      { status: 500 }
    );
  }
}