import os
import ollama
from typing import List, Dict
import chromadb
from chromadb.config import Settings

class NHSRAG:
    """NHS HR Policy RAG System using ChromaDB and Ollama"""
    
    def __init__(self, policies_dir: str = "../data/policies"):
        """Initialize the RAG system"""
        self.policies_dir = policies_dir
        
        # Initialize ChromaDB client (persistent storage)
        self.client = chromadb.PersistentClient(path="../data/chroma_db")
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="nhs_hr_policies",
            metadata={"description": "NHS ICT HR Policy Documents"}
        )
        
        print(f"✅ ChromaDB initialized. Collection has {self.collection.count()} chunks.")
    
    def load_policies(self):
        """Load all policy documents and chunk them into ChromaDB"""
        
        if self.collection.count() > 0:
            print(f"⚠️  Collection already has {self.collection.count()} chunks. Skipping load.")
            print("   Delete '../data/chroma_db' folder to reload from scratch.")
            return
        
        print("📚 Loading policy documents...")
        
        all_chunks = []
        all_metadatas = []
        all_ids = []
        
        # Read all policy files
        for filename in os.listdir(self.policies_dir):
            if filename.endswith('.txt'):
                filepath = os.path.join(self.policies_dir, filename)
                
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Simple chunking: split by double newlines (paragraphs)
                chunks = [chunk.strip() for chunk in content.split('\n\n') if chunk.strip()]
                
                # Add to collection
                for i, chunk in enumerate(chunks):
                    chunk_id = f"{filename}_{i}"
                    all_chunks.append(chunk)
                    all_metadatas.append({
                        "source": filename,
                        "chunk_index": i
                    })
                    all_ids.append(chunk_id)
                
                print(f"  ✅ {filename}: {len(chunks)} chunks")
        
        # Add all chunks to ChromaDB at once
        print(f"\n💾 Indexing {len(all_chunks)} total chunks into vector database...")
        self.collection.add(
            documents=all_chunks,
            metadatas=all_metadatas,
            ids=all_ids
        )
        
        print(f"✅ Indexed {self.collection.count()} chunks successfully!")
    
    def search(self, query: str, n_results: int = 3) -> List[Dict]:
        """Search for relevant policy chunks"""
        
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Format results
        formatted_results = []
        for i in range(len(results['ids'][0])):
            formatted_results.append({
                'text': results['documents'][0][i],
                'source': results['metadatas'][0][i]['source'],
                'distance': results['distances'][0][i] if 'distances' in results else None
            })
        
        return formatted_results
    
    def generate_answer(self, query: str, context_chunks: List[Dict]) -> str:
        """Generate answer using Ollama and retrieved context"""
        
        # Build context from retrieved chunks
        context = "\n\n".join([
            f"[From {chunk['source']}]\n{chunk['text']}" 
            for chunk in context_chunks
        ])
        
        # Create prompt
        prompt = f"""You are an NHS HR assistant. Answer the question based ONLY on the provided policy documents.

POLICY CONTEXT:
{context}

QUESTION: {query}

INSTRUCTIONS:
- Answer based only on the context above
- Cite which policy document you're referencing
- If the answer isn't in the context, say "I don't have information about that in the HR policies"
- Be concise and helpful

ANSWER:"""
        
        # Call Ollama
        print("🤖 Generating answer with Llama 3.1 8B...")
        response = ollama.generate(
            model='llama3.1:8b',
            prompt=prompt
        )
        
        return response['response']
    
    def ask(self, question: str) -> Dict:
        """Main RAG pipeline: search + generate"""
        
        print(f"\n❓ Question: {question}")
        print("\n🔍 Searching policy documents...")
        
        # Step 1: Retrieve relevant chunks
        chunks = self.search(question, n_results=3)
        
        print(f"✅ Found {len(chunks)} relevant chunks:")
        for i, chunk in enumerate(chunks, 1):
            print(f"  {i}. {chunk['source']} (relevance: {chunk['distance']:.3f})")
        
        # Step 2: Generate answer
        answer = self.generate_answer(question, chunks)
        
        return {
            'question': question,
            'answer': answer,
            'sources': chunks
        }

# Example usage
if __name__ == "__main__":
    # Initialize RAG system
    rag = NHSRAG()
    
    # Load policies (only needed once)
    rag.load_policies()
    
    # Test questions
    print("\n" + "="*60)
    print("🧪 TESTING RAG SYSTEM")
    print("="*60)
    
    test_questions = [
        "How many days sick leave am I entitled to?",
        "Can I work from home?",
        "What is the annual leave entitlement?"
    ]
    
    for question in test_questions:
        result = rag.ask(question)
        print(f"\n{'='*60}")
        print(f"ANSWER:\n{result['answer']}")
        print(f"{'='*60}")
