import os
import chromadb
from typing import List, Dict, Any
from abc import ABC, abstractmethod

class VectorStore(ABC):
    @abstractmethod
    def insert(self, ids: List[str], embeddings: List[List[float]], documents: List[str], metadatas: List[Dict[str, Any]]):
        pass
        
    @abstractmethod
    def delete(self, ids: List[str]):
        pass
        
    @abstractmethod
    def search(self, query_embedding: List[float], n_results: int = 5, where: Dict[str, Any] = None) -> Any:
        pass


class ChromaVectorStore(VectorStore):
    def __init__(self, collection_name: str = "jobs_collection"):
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "chroma_db")
        self.client = chromadb.PersistentClient(path=db_path)
        # Using cosine similarity is typical for text embeddings
        self.collection = self.client.get_or_create_collection(
            name=collection_name, 
            metadata={"hnsw:space": "cosine"}
        )
        
    def insert(self, ids: List[str], embeddings: List[List[float]], documents: List[str], metadatas: List[Dict[str, Any]]):
        if not ids:
            return
            
        # ChromaDB requires values in metadatas to be str, int, float or bool. Let's sanitize.
        sanitized_metadatas = []
        for meta in metadatas:
            clean_meta = {}
            for k, v in meta.items():
                if v is None:
                    continue
                if isinstance(v, (str, int, float, bool)):
                    clean_meta[k] = v
                elif isinstance(v, list):
                    clean_meta[k] = ", ".join([str(item) for item in v])
                else:
                    clean_meta[k] = str(v)
            sanitized_metadatas.append(clean_meta)
            
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=sanitized_metadatas
        )
        
    def delete(self, ids: List[str]):
        if not ids:
            return
        self.collection.delete(ids=ids)
        
    def delete_by_job_id(self, job_id: int):
        # Delete all chunks for a job ID
        self.collection.delete(where={"job_id": job_id})
        
    def search(self, query_embedding: List[float], n_results: int = 5, where: Dict[str, Any] = None) -> Any:
        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where
        )
