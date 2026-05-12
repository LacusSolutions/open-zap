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

  it('prepends DDI for partial input that does not parse as a full number', () => {
    expect(phoneToWhatsAppDigits('11', 'BR')).toBe('5511');
    expect(phoneToWhatsAppDigits('415', 'US')).toBe('1415');
  });

  it('handles very short partial input', () => {
    expect(phoneToWhatsAppDigits('9', 'BR')).toBe('559');
    expect(phoneToWhatsAppDigits('12', 'BR')).toBe('5512');
  });

  it('returns empty when input is only the country calling code', () => {
    expect(phoneToWhatsAppDigits('55', 'BR')).toBe('');
    expect(phoneToWhatsAppDigits('1', 'US')).toBe('');
  });

  it('strips formatting from partial input', () => {
    expect(phoneToWhatsAppDigits('(41', 'BR')).toBe('5541');
  });

  it('removes leading zeros from partial input', () => {
    expect(phoneToWhatsAppDigits('011', 'BR')).toBe('5511');
  });
});
