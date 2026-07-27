import logging
from pythonjsonlogger import jsonlogger
from opentelemetry import trace

class OpenTelemetryJsonFormatter(jsonlogger.JsonFormatter):
    """
    A custom JSON log formatter that automatically extracts Trace and Span IDs
    from the current OpenTelemetry context to link logs to traces.
    """
    def add_fields(self, log_record, record, message_dict):
        super(OpenTelemetryJsonFormatter, self).add_fields(log_record, record, message_dict)
        
        # Inject standard timestamp
        if not log_record.get('timestamp'):
            log_record['timestamp'] = self.formatTime(record, self.datefmt)

        # Inject OpenTelemetry context
        span = trace.get_current_span()
        if span.is_recording():
            ctx = span.get_span_context()
            log_record['trace_id'] = format(ctx.trace_id, '032x')
            log_record['span_id'] = format(ctx.span_id, '016x')
            
        # Standardize log levels
        log_record['level'] = record.levelname

def setup_structured_logging():
    """
    Configures the root logger to output structured JSON with Trace IDs.
    """
    logger = logging.getLogger()
    
    # Remove existing handlers to avoid duplicates
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
        
    logHandler = logging.StreamHandler()
    formatter = OpenTelemetryJsonFormatter(
        '%(timestamp)s %(level)s %(name)s %(message)s'
    )
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)
    logger.setLevel(logging.INFO)
    
    return logger

structured_logger = setup_structured_logging()
