import type { ReadonlyURLSearchParams } from 'next/navigation';

import type { FormValues } from './schema';
import { LINK_VARIANTS, type LinkVariant } from './whatsapp';

function isVariant(v: string): v is LinkVariant {
  return (LINK_VARIANTS as readonly string[]).includes(v);
}

export function encodeFormToParams(values: FormValues): URLSearchParams {
  const params = new URLSearchParams();

  if (values.variant && values.variant !== 'wa') params.set('v', values.variant);
  if (values.country && values.country !== 'BR') params.set('c', values.country);
  if (values.phone) params.set('p', values.phone);
  if (values.shortCode) params.set('sc', values.shortCode);
  if (values.text) params.set('t', values.text);

  if (values.showUtm) {
    params.set('utm', '1');
    if (values.utm?.source) params.set('us', values.utm.source);
    if (values.utm?.medium) params.set('um', values.utm.medium);
    if (values.utm?.campaign) params.set('uc', values.utm.campaign);
    if (values.utm?.content) params.set('uco', values.utm.content);
    if (values.utm?.term) params.set('ut', values.utm.term);
  }

  return params;
}

export function decodeFormFromParams(
  params: null | ReadonlyURLSearchParams | URLSearchParams,
): Partial<FormValues> {
  if (!params) return {};

  const out: Partial<FormValues> = {};
  const v = params.get('v');
  if (v && isVariant(v)) out.variant = v;

  const c = params.get('c');
  if (c) out.country = c;

  const p = params.get('p');
  if (p) out.phone = p;

  const sc = params.get('sc');
  if (sc) out.shortCode = sc;

  const t = params.get('t');
  if (t) out.text = t;

  const utmOn = params.get('utm') === '1';
  if (utmOn) {
    out.showUtm = true;
    out.utm = {
      source: params.get('us') ?? '',
      medium: params.get('um') ?? '',
      campaign: params.get('uc') ?? '',
      content: params.get('uco') ?? '',
      term: params.get('ut') ?? '',
    };
  }

  return out;
}
