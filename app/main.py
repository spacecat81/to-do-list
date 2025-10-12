from fastapi import FastAPI

from routers.endpoints import router

app = FastAPI()

app.include_router(router, tags=["To-do list"])


@app.get("/ping", tags=["Ping"], summary="Pong :D")
async def ping():
    return "pong"
