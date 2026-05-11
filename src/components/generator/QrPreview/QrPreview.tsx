'use client';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactElement, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { downloadPng, downloadSvg, drawToCanvas, type ErrorCorrectionLevel } from '@/lib/qrcode';

interface QrPreviewProps {
  onDownload?: (format: 'png' | 'svg') => void;
  url: string;
}

const LEVELS: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];

export function QrPreview({ url, onDownload }: QrPreviewProps): ReactElement {
  const t = useTranslations('preview.qr');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [level, setLevel] = useState<ErrorCorrectionLevel>('M');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawToCanvas(canvas, url || ' ', {
      size,
      margin,
      errorCorrectionLevel: level,
    }).catch(() => {
      /* ignore */
    });
  }, [url, size, margin, level]);

  async function onPng(): Promise<void> {
    await downloadPng(url, 'openzap-qr.png', {
      size,
      margin,
      errorCorrectionLevel: level,
    });
    onDownload?.('png');
  }

  async function onSvg(): Promise<void> {
    await downloadSvg(url, 'openzap-qr.svg', {
      size,
      margin,
      errorCorrectionLevel: level,
    });
    onDownload?.('svg');
  }

  const displayMaxPx = Math.min(size, 240);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center rounded-2xl bg-white p-4 ring-1 ring-[var(--color-border)]">
        <canvas
          ref={canvasRef}
          aria-label={t('title')}
          className="h-auto max-w-full"
          style={{ width: `${displayMaxPx}px` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="qr-size">
            {t('size')} <span className="text-xs text-[var(--color-text-muted)]">({size}px)</span>
          </Label>
          <input
            id="qr-size"
            type="range"
            min={160}
            max={640}
            step={16}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
        <div>
          <Label htmlFor="qr-margin">
            {t('margin')} <span className="text-xs text-[var(--color-text-muted)]">({margin})</span>
          </Label>
          <input
            id="qr-margin"
            type="range"
            min={0}
            max={8}
            step={1}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>
        <div>
          <Label htmlFor="qr-level">{t('errorCorrection')}</Label>
          <select
            id="qr-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as ErrorCorrectionLevel)}
            className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-brand-500"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {t(`levels.${l}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="primary" size="sm" onClick={onPng}>
          <Download className="size-4" aria-hidden="true" />
          {t('downloadPng')}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onSvg}>
          <Download className="size-4" aria-hidden="true" />
          {t('downloadSvg')}
        </Button>
      </div>
    </div>
  );
}
