from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import NHSRAG
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="NHS HR RAG API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system (load once at startup)
rag = None

@app.on_event("startup")
async def startup_event():
    """Load RAG system when API starts"""
    global rag
    print("🚀 Starting NHS HR RAG API...")
    rag = NHSRAG()
    rag.load_policies()
    print("✅ RAG system ready!")

# Request/Response models
class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    question: str
    answer: str
    sources: list

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "NHS HR RAG API",
        "version": "1.0.0"
    }

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """Ask a question about HR policies"""
    
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        result = rag.ask(request.question)
        return QuestionResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.get("/stats")
async def get_stats():
    """Get system statistics"""
    return {
        "total_chunks": rag.collection.count(),
        "policies_loaded": len([f for f in rag.client.list_collections()]),
        "model": "llama3.1:8b"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
