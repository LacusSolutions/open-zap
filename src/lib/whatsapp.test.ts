import { describe, expect, it } from 'vitest';

import {
  buildWhatsAppUrl,
  normalizePhone,
  sanitizeShortCode,
  variantRequiresPhone,
  variantSupportsText,
  variantSupportsUtm,
} from './whatsapp';

describe('normalizePhone', () => {
  it('strips non-digits and leading zeros', () => {
    expect(normalizePhone('+55 (11) 91234-5678')).toBe('5511912345678');
    expect(normalizePhone('0044 7911 123456')).toBe('447911123456');
    expect(normalizePhone(undefined)).toBe('');
    expect(normalizePhone('')).toBe('');
  });
});

describe('sanitizeShortCode', () => {
  it('keeps only alphanumerics, uppercased', () => {
    expect(sanitizeShortCode('h4x-yz ab12')).toBe('H4XYZAB12');
    expect(sanitizeShortCode(undefined)).toBe('');
  });
});

describe('buildWhatsAppUrl — wa variant', () => {
  it('builds bare wa.me when no phone and no text', () => {
    expect(buildWhatsAppUrl({ variant: 'wa' })).toBe('https://wa.me');
  });

  it('includes phone and encoded text', () => {
    const url = buildWhatsAppUrl({
      variant: 'wa',
      phone: '+1 555-123-4567',
      text: 'Hello, world!\nNice to meet you.',
    });
    expect(url).toBe('https://wa.me/15551234567?text=Hello%2C%20world!%0ANice%20to%20meet%20you.');
  });

  it('omits the text param when message is empty', () => {
    expect(buildWhatsAppUrl({ variant: 'wa', phone: '5511912345678' })).toBe(
      'https://wa.me/5511912345678',
    );
  });
});

describe('buildWhatsAppUrl — api variant', () => {
  it('builds api.whatsapp.com/send with phone, text and UTMs', () => {
    const url = buildWhatsAppUrl({
      variant: 'api',
      phone: '15551234567',
      text: 'Hi',
      utm: {
        source: 'instagram',
        medium: 'bio',
        campaign: 'summer sale',
      },
    });
    expect(url).toBe(
      'https://api.whatsapp.com/send?phone=15551234567&text=Hi&utm_source=instagram&utm_medium=bio&utm_campaign=summer%20sale',
    );
  });

  it('works without phone when sharing via api variant', () => {
    const url = buildWhatsAppUrl({ variant: 'api', text: 'Hey' });
    expect(url).toBe('https://api.whatsapp.com/send?text=Hey');
  });
});

describe('buildWhatsAppUrl — deepLink variant', () => {
  it('produces whatsapp:// with encoded text', () => {
    expect(
      buildWhatsAppUrl({
        variant: 'deepLink',
        phone: '15551234567',
        text: 'yo',
      }),
    ).toBe('whatsapp://send?phone=15551234567&text=yo');
  });
});

describe('buildWhatsAppUrl — web variant', () => {
  it('produces web.whatsapp.com/send', () => {
    expect(buildWhatsAppUrl({ variant: 'web', phone: '15551234567' })).toBe(
      'https://web.whatsapp.com/send?phone=15551234567',
    );
  });
});

describe('buildWhatsAppUrl — call variant', () => {
  it('uses /call path', () => {
    expect(buildWhatsAppUrl({ variant: 'call', phone: '15551234567' })).toBe(
      'https://wa.me/call/15551234567',
    );
  });
  it('falls back to /call when phone missing', () => {
    expect(buildWhatsAppUrl({ variant: 'call' })).toBe('https://wa.me/call');
  });
});

describe('buildWhatsAppUrl — share variant', () => {
  it('omits the phone entirely and keeps text', () => {
    expect(buildWhatsAppUrl({ variant: 'share', text: 'hi' })).toBe('https://wa.me/?text=hi');
  });
});

describe('buildWhatsAppUrl — shortCode variant', () => {
  it('routes to wa.me/message/<CODE>', () => {
    expect(buildWhatsAppUrl({ variant: 'shortCode', shortCode: 'abc-123' })).toBe(
      'https://wa.me/message/ABC123',
    );
  });
  it('returns base path when no code', () => {
    expect(buildWhatsAppUrl({ variant: 'shortCode' })).toBe('https://wa.me/message/');
  });
});

describe('variant predicates', () => {
  it('requires phone for wa/api/deepLink/web/call', () => {
    (['wa', 'api', 'deepLink', 'web', 'call'] as const).forEach((v) =>
      expect(variantRequiresPhone(v)).toBe(true),
    );
    expect(variantRequiresPhone('share')).toBe(false);
    expect(variantRequiresPhone('shortCode')).toBe(false);
  });

  it('supports text in chat variants and share', () => {
    (['wa', 'api', 'deepLink', 'web', 'share'] as const).forEach((v) =>
      expect(variantSupportsText(v)).toBe(true),
    );
    expect(variantSupportsText('call')).toBe(false);
    expect(variantSupportsText('shortCode')).toBe(false);
  });

  it('only api variant supports UTM', () => {
    expect(variantSupportsUtm('api')).toBe(true);
    expect(variantSupportsUtm('wa')).toBe(false);
  });
});
