import json
import os
import google.generativeai as genai
from typing import List, Dict, Any
from app.rag.intent.intent_detector import IntentDetector
from app.rag.retrievers.hybrid_retriever import HybridRetriever
from app.rag.rerankers.semantic_reranker import SemanticReranker
from app.rag.prompts.context_builder import ContextBuilder

class ChatEngine:
    def __init__(self, retriever: HybridRetriever):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        
        self.retriever = retriever
        self.intent_detector = IntentDetector()
        self.reranker = SemanticReranker()
        self.builder = ContextBuilder(max_tokens=4000)

    def generate_response(self, query: str, user_id: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        # 1. Detect Intent
        intent = self.intent_detector.detect_intent(query)
        collection = intent if intent in ["jobs", "users", "learning", "companies"] else "jobs"
        
        # 2. Retrieve
        raw_results = self.retriever.retrieve(collection, query)
        reranked = self.reranker.rerank(raw_results, query)
        context = self.builder.build_context(reranked)
        
        # 3. Build Prompt
        system_prompt = f"""
        You are a Premium AI Career Assistant for 'AI Job Finder'.
        Answer the user's question accurately. 
        You MUST ground your response in the retrieved CONTEXT below.
        If the CONTEXT does not contain the answer, rely on your general knowledge but mention that it's general advice.
        
        CONTEXT:
        {context}
        
        Return your response strictly as a JSON object with this structure:
        {{
            "response": "Your markdown formatted response here.",
            "citations": ["List of sources you used from the context, e.g. 'Job ID: 123', 'Resume Skills'"],
            "suggested_actions": ["List of 2-3 short suggested prompts for the user to click next"]
        }}
        """
        
        # We start a chat session with the model using the history
        # Since Gemini's chat requires alternating user/model turns, we will inject the system prompt into the latest user query for simplicity in this MVP.
        chat = self.model.start_chat(history=history)
        
        full_query = f"{system_prompt}\n\nUSER QUERY: {query}"
        
        try:
            result = chat.send_message(full_query)
            text = result.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
                
            parsed = json.loads(text.strip())
            return parsed
        except Exception as e:
            print(f"Chat error: {e}")
            # Fallback
            return {
                "response": "I'm sorry, I couldn't process that request at the moment. Please try again.",
                "citations": [],
                "suggested_actions": ["Try again"]
            }
