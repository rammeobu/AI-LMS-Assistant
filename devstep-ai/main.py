from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DevStep AI Worker API",
    description="Microservice for handling RAG, Vector Search, and Background Crawling for DevStep.",
    version="1.0.0",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "DevStep AI Worker API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
