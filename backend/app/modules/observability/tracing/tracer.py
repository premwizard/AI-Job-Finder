from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from fastapi import FastAPI
import logging

logger = logging.getLogger(__name__)

def init_tracer(app: FastAPI):
    """
    Initializes OpenTelemetry Tracing for the FastAPI application.
    For production, replace ConsoleSpanExporter with OTLPExporter to send traces to Jaeger/Zipkin.
    """
    try:
        # Set the global TracerProvider
        provider = TracerProvider()
        trace.set_tracer_provider(provider)
        
        # Use ConsoleSpanExporter for development. 
        # In production, use OTLPSpanExporter.
        processor = BatchSpanProcessor(ConsoleSpanExporter())
        provider.add_span_processor(processor)
        
        # Auto-instrument FastAPI
        FastAPIInstrumentor.instrument_app(app)
        
        logger.info("OpenTelemetry Tracer initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize OpenTelemetry Tracer: {e}")
