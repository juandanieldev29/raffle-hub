export async function GET(request: Request): Promise<Response> {
  const searchParams = new URL(request.url).searchParams;
  const res = await fetch(`http://localhost:3002/api/raffle?${searchParams}`, {
    headers: request.headers,
    cache: 'no-store',
  });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch('http://localhost:3002/api/raffle', {
    headers: request.headers,
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify(body),
  });
  return res;
}
