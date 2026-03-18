import chromadb
from chromadb.config import Settings
import glob
import ollama

class NHSRAG:
    def __init__(self, policies_dir="../data/policies"):
        self.policies_dir = policies_dir
        
        # Initialize ChromaDB with persistent storage
        self.client = chromadb.PersistentClient(path="../data/chroma_db")
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="nhs_hr_policies",
            metadata={"description": "NHS ICT HR Policy Documents"}
        )
        
        print(f"✅ ChromaDB initialized. Collection has {self.collection.count()} chunks.")
        
        # Load policies if collection is empty
        if self.collection.count() == 0:
            self.load_policies()
        
        # ALWAYS count actual files (not relying on increment)
        policy_files = glob.glob(f"{self.policies_dir}/*.txt")
        self.num_documents = len(policy_files)
        print(f"📊 Found {self.num_documents} policy documents")
    
    def load_policies(self):
        """Load all policy documents and index them"""
        print("📚 Loading policy documents...")
        
        policy_files = glob.glob(f"{self.policies_dir}/*.txt")
        all_chunks = []
        all_metadatas = []
        all_ids = []
        chunk_id = 0
        
        for policy_file in policy_files:
            filename = policy_file.split('/')[-1]
            
            with open(policy_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split by double newlines (paragraphs)
            chunks = [chunk.strip() for chunk in content.split('\n\n') if chunk.strip()]
            
            print(f"  ✅ {filename}: {len(chunks)} chunks")
            
            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                all_metadatas.append({
                    "source": filename,
                    "chunk_index": i
                })
                all_ids.append(f"chunk_{chunk_id}")
                chunk_id += 1
        
        # Index all chunks
        print(f"💾 Indexing {len(all_chunks)} total chunks into vector database...")
        self.collection.add(
            documents=all_chunks,
            metadatas=all_metadatas,
            ids=all_ids
        )
        print(f"✅ Indexed {len(all_chunks)} chunks successfully!")
    
    def search(self, query, n_results=3):
        """Search for relevant policy chunks"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        chunks = []
        for i in range(len(results['documents'][0])):
            chunks.append({
                'text': results['documents'][0][i],
                'source': results['metadatas'][0][i]['source'],
                'distance': results['distances'][0][i]
            })
        
        return chunks
    
    def generate_answer(self, query, context_chunks):
        """Generate answer using Ollama"""
        context = "\n\n".join([f"[From {chunk['source']}]\n{chunk['text']}" for chunk in context_chunks])
        
        prompt = f"""You are an NHS HR assistant. Answer the question based ONLY on the provided policy documents.

POLICY CONTEXT:
{context}

QUESTION: {query}

INSTRUCTIONS:
- Answer based only on the context above
- Cite which policy document you're referencing
- If the answer isn't in the context, say "I don't have information about that in the available policies"
- Be concise and helpful

ANSWER:"""
        
        response = ollama.generate(
            model='llama3.1:8b',
            prompt=prompt
        )
        
        return response['response']
    
    def ask(self, question):
        """Main RAG pipeline: search + generate"""
        print(f"🔍 Searching for: {question}")
        chunks = self.search(question, n_results=3)
        
        print(f"📄 Found relevant chunks:")
        for i, chunk in enumerate(chunks, 1):
            print(f"  {i}. {chunk['source']} (relevance: {chunk['distance']:.3f})")
        
        print("🤖 Generating answer with Llama 3.1 8B...")
        answer = self.generate_answer(question, chunks)
        
        return {
            'question': question,
            'answer': answer,
            'sources': [{'source': c['source'], 'distance': c['distance']} for c in chunks]
        }
