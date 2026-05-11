import {
  type AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

export type { AsYouType, CountryCode };

export interface CountryEntry {
  code: CountryCode;
  dialCode: string;
}

const FEATURED_COUNTRIES: CountryCode[] = ['BR', 'US', 'GB', 'ES', 'MX', 'PT', 'AR', 'CL', 'CO'];

export function getSortedCountries(): CountryEntry[] {
  const all = getCountries().map<CountryEntry>((code) => ({
    code,
    dialCode: `+${getCountryCallingCode(code)}`,
  }));

  const featured = FEATURED_COUNTRIES.map(
    (code) =>
      all.find((c) => c.code === code) ?? {
        code,
        dialCode: `+${getCountryCallingCode(code)}`,
      },
  );

  const rest = all
    .filter((c) => !FEATURED_COUNTRIES.includes(c.code))
    .sort((a, b) => a.code.localeCompare(b.code));

  return [...featured, ...rest];
}

export function getFlagEmoji(countryCode: string): string {
  const base = 0x1f1e6 - 'A'.charCodeAt(0);

  return String.fromCodePoint(
    ...Array.from(countryCode.toUpperCase(), (c) => c.charCodeAt(0) + base),
  );
}

export function parsePhone(raw: string, country: CountryCode): string {
  const parsed = parsePhoneNumberFromString(raw, country);

  return parsed?.number.replace(/^\+/, '') ?? '';
}

/**
 * Build the digits-only E.164-style phone for WhatsApp URLs (e.g.
 * `wa.me/<digits>`), always including the country dialing code (DDI).
 *
 * - When the input parses as a phone number for the given country, returns the
 *   full E.164 number minus the leading `+` (handled by libphonenumber-js).
 * - When the input is partial/typing and does not parse, falls back to a safe
 *   heuristic: strips non-digits and a leading `0`, and prepends the country
 *   calling code unless the digits already start with it.
 * - Returns `''` for empty input so callers can branch on "no phone yet".
 */
export function phoneToWhatsAppDigits(raw: string | undefined, country: CountryCode): string {
  if (!raw) return '';

  const parsed = parsePhoneNumberFromString(raw, country);
  if (parsed?.number) return parsed.number.replace(/^\+/, '');

  const callingCode = getCountryCallingCode(country);
  const digits = raw.replace(/\D+/g, '').replace(/^0+/, '');
  if (!digits) return '';

  return digits.startsWith(callingCode) ? digits : `${callingCode}${digits}`;
}

export function isValidFor(raw: string, country: CountryCode): boolean {
  if (!raw.trim()) return false;

  return isValidPhoneNumber(raw, country);
}

export function formatAsYouType(raw: string, country: CountryCode): string {
  if (!raw) return '';

  const parsed = parsePhoneNumberFromString(raw, country);

  return parsed?.formatInternational() ?? raw;
}

export function localizedCountryName(code: CountryCode, locale: string): string {
  try {
    const display = new Intl.DisplayNames([locale], { type: 'region' });

    return display.of(code) ?? code;
  } catch {
    return code;
  }
}
