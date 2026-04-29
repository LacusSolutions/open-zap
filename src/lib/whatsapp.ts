export const LINK_VARIANTS = [
  "wa",
  "api",
  "deepLink",
  "web",
  "call",
  "share",
  "shortCode",
] as const;

export type LinkVariant = (typeof LINK_VARIANTS)[number];

export type UtmParams = Partial<{
  campaign: string;
  content: string;
  medium: string;
  source: string;
  term: string;
}>;

export interface WhatsAppLinkInput {
  phone?: string;
  shortCode?: string;
  text?: string;
  utm?: UtmParams;
  variant: LinkVariant;
}

export const MAX_MESSAGE_LENGTH = 4096;
export const VARIANTS_REQUIRING_PHONE: readonly LinkVariant[] = [
  "wa",
  "api",
  "deepLink",
  "web",
  "call",
];
export const VARIANTS_SUPPORTING_TEXT: readonly LinkVariant[] = [
  "wa",
  "api",
  "deepLink",
  "web",
  "share",
];
export const VARIANTS_SUPPORTING_UTM: readonly LinkVariant[] = ["api"];

const UTM_KEY_MAP: Record<keyof UtmParams, string> = {
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  content: "utm_content",
  term: "utm_term",
};

export function normalizePhone(raw: string | undefined): string {
  if (!raw) return "";

  return raw.replace(/\D+/g, "").replace(/^0+/, "");
}

export function sanitizeShortCode(raw: string | undefined): string {
  if (!raw) return "";

  return raw.replace(/[^A-Z0-9]/gi, "").toUpperCase();
}

function encodeText(text: string | undefined): string | undefined {
  if (!text) return undefined;

  return encodeURIComponent(text);
}

function buildQueryString(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string] => {
      return typeof entry[1] === "string" && entry[1].length > 0;
    },
  );

  if (entries.length === 0) return "";

  return `?${entries.map(([k, v]) => `${k}=${v}`).join("&")}`;
}

function resolveUtm(
  utm: undefined | UtmParams,
): Record<string, string | undefined> {
  if (!utm) return {};

  return Object.fromEntries(
    (Object.keys(UTM_KEY_MAP) as (keyof UtmParams)[])
      .filter((k) => typeof utm[k] === "string" && utm[k] !== "")
      .map((k) => [UTM_KEY_MAP[k], encodeURIComponent(utm[k] as string)]),
  );
}

export function buildWhatsAppUrl(input: WhatsAppLinkInput): string {
  const { variant } = input;
  const phone = normalizePhone(input.phone);
  const text = encodeText(input.text);
  const shortCode = sanitizeShortCode(input.shortCode);

  switch (variant) {
    case "api": {
      const query = buildQueryString({
        phone: phone || undefined,
        text,
        ...resolveUtm(input.utm),
      });

      return `https://api.whatsapp.com/send${query}`;
    }
    case "call": {
      if (!phone) return "https://wa.me/call";

      return `https://wa.me/call/${phone}`;
    }
    case "deepLink": {
      const query = buildQueryString({
        phone: phone || undefined,
        text,
      });

      return `whatsapp://send${query}`;
    }
    case "share": {
      return `https://wa.me/${buildQueryString({ text })}`;
    }
    case "shortCode": {
      if (!shortCode) return "https://wa.me/message/";

      return `https://wa.me/message/${shortCode}`;
    }
    case "wa": {
      const base = phone ? `https://wa.me/${phone}` : "https://wa.me";

      return `${base}${buildQueryString({ text })}`;
    }
    case "web": {
      const query = buildQueryString({
        phone: phone || undefined,
        text,
      });

      return `https://web.whatsapp.com/send${query}`;
    }
    default: {
      const _exhaustive: never = variant;
      void _exhaustive;
      throw new Error(`Unknown WhatsApp link variant: ${String(variant)}`);
    }
  }
}

export function variantRequiresPhone(variant: LinkVariant): boolean {
  return VARIANTS_REQUIRING_PHONE.includes(variant);
}

export function variantSupportsText(variant: LinkVariant): boolean {
  return VARIANTS_SUPPORTING_TEXT.includes(variant);
}

export function variantSupportsUtm(variant: LinkVariant): boolean {
  return VARIANTS_SUPPORTING_UTM.includes(variant);
}

export function variantRequiresShortCode(variant: LinkVariant): boolean {
  return variant === "shortCode";
}
