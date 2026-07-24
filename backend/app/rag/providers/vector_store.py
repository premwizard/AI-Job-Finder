import chromadb
from typing import List, Dict, Any, Optional

class ChromaMultiCollectionStore:
    def __init__(self, db_path: str = "./chroma_db"):
        self.client = chromadb.PersistentClient(path=db_path)
        # We don't initialize collections here; they are created on demand.

    def get_collection(self, collection_name: str):
        return self.client.get_or_create_collection(name=collection_name)

    def add_documents(self, collection_name: str, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        collection = self.get_collection(collection_name)
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, collection_name: str, query_text: str, n_results: int = 5, where: Optional[Dict[str, Any]] = None):
        collection = self.get_collection(collection_name)
        
        kwargs = {
            "query_texts": [query_text],
            "n_results": n_results
        }
        if where:
            kwargs["where"] = where
            
        results = collection.query(**kwargs)
        return results

    def get_collection_stats(self, collection_name: str) -> Dict[str, Any]:
        collection = self.get_collection(collection_name)
        return {
            "name": collection_name,
            "count": collection.count()
        }
