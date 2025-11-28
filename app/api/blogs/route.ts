import { NextResponse } from 'next/server';
import { getSortedPostsData } from '../../../lib/blog';

export async function GET() {
  const posts = getSortedPostsData();
  return NextResponse.json(posts);
}
