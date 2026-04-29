import QRCode, { type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from 'qrcode';

export type ErrorCorrectionLevel = QRCodeErrorCorrectionLevel;

export interface QrCodeOptions {
  darkColor?: string;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  lightColor?: string;
  margin?: number;
  size?: number;
}

const DEFAULTS: {
  darkColor: string;
  lightColor: string;
} & Required<Omit<QrCodeOptions, 'darkColor' | 'lightColor'>> = {
  size: 320,
  margin: 2,
  errorCorrectionLevel: 'M',
  darkColor: '#075E54',
  lightColor: '#FFFFFF',
};

function mergeOptions(opts?: QrCodeOptions): Required<QrCodeOptions> {
  return {
    size: opts?.size ?? DEFAULTS.size,
    margin: opts?.margin ?? DEFAULTS.margin,
    errorCorrectionLevel: opts?.errorCorrectionLevel ?? DEFAULTS.errorCorrectionLevel,
    darkColor: opts?.darkColor ?? DEFAULTS.darkColor,
    lightColor: opts?.lightColor ?? DEFAULTS.lightColor,
  };
}

function toDataUrlOptions(opts: Required<QrCodeOptions>): QRCodeToDataURLOptions {
  return {
    width: opts.size,
    margin: opts.margin,
    errorCorrectionLevel: opts.errorCorrectionLevel,
    color: { dark: opts.darkColor, light: opts.lightColor },
  };
}

export async function toPngDataUrl(text: string, opts?: QrCodeOptions): Promise<string> {
  return QRCode.toDataURL(text, toDataUrlOptions(mergeOptions(opts)));
}

export async function toSvgString(text: string, opts?: QrCodeOptions): Promise<string> {
  const merged = mergeOptions(opts);

  return QRCode.toString(text, {
    type: 'svg',
    width: merged.size,
    margin: merged.margin,
    errorCorrectionLevel: merged.errorCorrectionLevel,
    color: { dark: merged.darkColor, light: merged.lightColor },
  });
}

export async function drawToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  opts?: QrCodeOptions,
): Promise<void> {
  const merged = mergeOptions(opts);

  await QRCode.toCanvas(canvas, text, {
    width: merged.size,
    margin: merged.margin,
    errorCorrectionLevel: merged.errorCorrectionLevel,
    color: { dark: merged.darkColor, light: merged.lightColor },
  });

  // `qrcode`'s canvas renderer sets `style.width` / `style.height` to the bitmap
  // size (see node_modules/qrcode/lib/renderer/canvas.js). That breaks responsive
  // CSS: e.g. `max-width: 100%` shrinks the used width while the inline height
  // stays at the full pixel value, so the QR is stretched vertically. Drop those
  // inline layout dimensions; keep `canvas.width` / `canvas.height` attributes
  // for the actual bitmap resolution — author CSS controls on-screen size.
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
}

export function downloadBlob(blob: Blob, filename: string): void {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export async function downloadPng(
  text: string,
  filename: string,
  opts?: QrCodeOptions,
): Promise<void> {
  const dataUrl = await toPngDataUrl(text, opts);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  downloadBlob(blob, filename);
}

export async function downloadSvg(
  text: string,
  filename: string,
  opts?: QrCodeOptions,
): Promise<void> {
  const svg = await toSvgString(text, opts);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, filename);
}
