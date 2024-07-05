export async function GET(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  const res = await fetch(`http://localhost:3002${pathname}`, {
    headers: request.headers,
    cache: 'no-store',
  });
  const data = await res.json();
  return Response.json(data);
}
