"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";

import { ChatBubble } from "@/components/generator/ChatBubble";
import { CopyButton } from "@/components/generator/CopyButton";
import { QrPreview } from "@/components/generator/QrPreview";
import { Button } from "@/components/ui/Button";

interface PreviewPanelProps {
  message?: string;
  onCopy?: () => void;
  onOpen?: () => void;
  onQrDownload?: (format: "png" | "svg") => void;
  url: string;
}

export function PreviewPanel({
  url,
  message,
  onCopy,
  onOpen,
  onQrDownload,
}: PreviewPanelProps): ReactElement {
  const t = useTranslations("preview");
  const tUrl = useTranslations("preview.url");
  const openable = /^https?:|^whatsapp:/.test(url);

  return (
    <aside className="flex flex-col gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-6 lg:sticky lg:top-6 lg:self-start">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          {t("chatHint")}
        </p>
      </header>

      <ChatBubble message={message} />

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {tUrl("title")}
        </h3>
        <div className="break-all rounded-lg bg-[var(--color-surface-muted)] px-3 py-2 font-mono text-xs text-[var(--color-text)]">
          {url}
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={url} variant="primary" size="sm" onCopy={onCopy} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!openable}
            onClick={() => {
              if (!openable) return;
              onOpen?.();
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            title={tUrl("openHint")}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            {tUrl("open")}
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {t("qr.title")}
        </h3>
        <QrPreview url={url} onDownload={onQrDownload} />
      </section>
    </aside>
  );
}
