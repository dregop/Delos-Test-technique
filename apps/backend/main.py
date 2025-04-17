from fastapi import FastAPI, Request, Query, Header, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
import random
import asyncio
import httpx
import os
from dotenv import load_dotenv
from collections import Counter

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env")

app = FastAPI()

SPORT_RESPONSES = {
    "tennis": "TENNIS",
    "football": "FOOTBALL",
    "rugby": "RUGBY",
    "volley": "VOLLEY",
    "cyclisme": "CYCLISME"
}

async def get_user_id_from_token(token: str) -> Optional[str]:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}"}
        )
        print("🔍 Supabase user lookup:", res.status_code, res.text)
        if res.status_code == 200:
            return res.json().get("id")
    return None

@app.post("/chat")
async def chat_endpoint(
    request: Request,
    sport: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    body = await request.json()
    question = body.get("question", "")

    if sport.lower() not in SPORT_RESPONSES:
        raise HTTPException(status_code=400, detail="Sport not supported")

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    
    print("🔐 Authorization header:", authorization)

    token = authorization.replace("Bearer ", "")
    user_id = await get_user_id_from_token(token)
    if not user_id:
        print(f"❌ Invalid token: {token}")
        raise HTTPException(status_code=401, detail="Invalid token")

    base_word = SPORT_RESPONSES[sport.lower()]
    count = random.randint(10, 20)
    full_response = " ".join([base_word] * count)

    # StreamingResponse generator
    async def word_stream():
        for word in full_response.split():
            yield word + " "
            await asyncio.sleep(0.08)

    # Enregistrement dans Supabase DB
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{SUPABASE_URL}/rest/v1/messages",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            json={
                "user_id": user_id,
                "sport": sport,
                "question": question,
                "answer": full_response,
            }
        )

    return StreamingResponse(word_stream(), media_type="text/plain")


@app.get("/admin/stats")
async def get_question_stats(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user_id = await get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/messages?select=user_id",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            },
        )

    if res.status_code != 200:
        print("🛑 Supabase error:", res.text)
        raise HTTPException(status_code=500, detail="Error fetching stats")

    messages = res.json()


    user_counts = Counter([msg["user_id"] for msg in messages])
    results = [{"user_id": uid, "question_count": count} for uid, count in user_counts.items()]
    print("📊 Results:", results)
    return results