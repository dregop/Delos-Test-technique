import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');

  const res = await fetch(`${process.env.API_BASE_URL}/admin/stats`, {
    headers: {
      Authorization: auth || '',
    },
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
