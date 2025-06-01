import { NextRequest, NextResponse } from 'next/server'
export async function GET(request) { const url = new URL(request.url); const query = url.searchParams.get('query'); const results = query ? [{ id: '1', title: '紫薇斗数基础', content: '紫薇斗数是重要的命理学分支...' }] : []; return Response.json({ results, total: results.length, query }); }
