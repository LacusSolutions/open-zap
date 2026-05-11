import { describe, expect, it } from 'vitest';

import { phoneToWhatsAppDigits } from './phone';

describe('phoneToWhatsAppDigits', () => {
  it('returns "" for empty/undefined input', () => {
    expect(phoneToWhatsAppDigits(undefined, 'BR')).toBe('');
    expect(phoneToWhatsAppDigits('', 'BR')).toBe('');
  });

  it('prepends the BR country code (55) for a valid local mobile number', () => {
    expect(phoneToWhatsAppDigits('(11) 91234-5678', 'BR')).toBe('5511912345678');
  });

  it('prepends the US country code (1) for a valid local number', () => {
    expect(phoneToWhatsAppDigits('(415) 555-0132', 'US')).toBe('14155550132');
  });

  it('keeps the country code without doubling when the user enters E.164 form', () => {
    expect(phoneToWhatsAppDigits('+55 (11) 91234-5678', 'BR')).toBe('5511912345678');
    expect(phoneToWhatsAppDigits('5511912345678', 'BR')).toBe('5511912345678');
  });

  it('always returns digits starting with the country dialing code (DDI)', () => {
    // Partial input that libphonenumber cannot fully parse still gets the DDI
    // prefix from the heuristic fallback so the generated URL keeps growing
    // while the user is typing.
    expect(phoneToWhatsAppDigits('11', 'BR').startsWith('55')).toBe(true);
    expect(phoneToWhatsAppDigits('415', 'US').startsWith('1')).toBe(true);
  });
});
