export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch('http://localhost:3001/api/auth/google', {
    headers: request.headers,
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify(body),
  });
  return res;
}
