/**
 * Frontend Unit Test — Services & Utility Functions (frontend/src/__tests__/frontend_services.test.ts)
 * Tests className merging utilities and API client defaults.
 */
import { cn } from '../lib/utils';
import { api } from '../services/api';

describe('Frontend Utility & API Tests', () => {
  test('cn utility correctly merges Tailwind classes and conditions', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', false && 'hidden', true && 'text-white');
    expect(result).toContain('px-2');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('text-white');
    expect(result).not.toContain('hidden');
  });

  test('api service client is initialized with correct defaults', () => {
    expect(api).toBeDefined();
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
