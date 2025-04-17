import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport");

  const body = await req.text();
  const authHeader = req.headers.get("authorization");

  console.log("authHeader", authHeader);

  const response = await fetch(`${process.env.API_BASE_URL}/chat?sport=${sport}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}), // 👈 transmet bien le token
    },
    body,
  });

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
