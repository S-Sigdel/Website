import { NextResponse } from 'next/server';

// In-memory storage for the latest status (Note: This is ephemeral in serverless)
// For production persistence, use Vercel KV or a database.
let latestStatus: any = null;
let lastUpdate = 0;

const API_SECRET = process.env.API_SECRET || 'default-secret-key';

export async function GET() {
  try {
    // If we have data in memory, return it
    if (latestStatus) {
      const now = Date.now();
      const isOffline = (now - lastUpdate) > 60000; // Considered offline if no update in 60s
      
      return NextResponse.json({
        ...latestStatus,
        isOffline,
        lastUpdate
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // Fallback to empty/loading state if no data received yet
    return NextResponse.json(
      { 
        message: 'No data received yet',
        isOffline: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${API_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate basic structure
    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update in-memory store
    latestStatus = data;
    lastUpdate = Date.now();

    return NextResponse.json({ success: true, timestamp: lastUpdate });
  } catch (error) {
    console.error('Error updating system status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}



