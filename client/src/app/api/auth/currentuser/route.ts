export async function GET(request: Request): Promise<Response> {
  const res = await fetch('http://localhost:3001/api/auth/currentuser', {
    headers: request.headers,
    cache: 'no-store',
  });
  const data = await res.json();
  return Response.json(data, {
    headers: res.headers,
  });
}
