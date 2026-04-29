"use client";

import { Check, CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactElement, useMemo } from "react";

interface ChatBubbleProps {
  message?: string;
}

function formatLinks(text: string): ReactElement[] {
  const parts = text.split(/(\bhttps?:\/\/\S+|\bwww\.\S+)/g);

  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part) || /^www\./.test(part)) {
      return (
        <a
          key={i}
          href={part.startsWith("http") ? part : `https://${part}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent-500 underline decoration-accent-500/40 hover:decoration-accent-500"
        >
          {part}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

export function ChatBubble({ message }: ChatBubbleProps): ReactElement {
  const t = useTranslations("preview");
  const now = useMemo(
    () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [],
  );
  const content = message?.trim();

  return (
    <div className="chat-pattern rounded-2xl p-4 sm:p-6">
      <div className="flex justify-end">
        <div className="relative max-w-[85%] rounded-lg bg-[var(--color-chat-bubble-sent)] px-3 py-2 text-sm text-[#111b21] shadow-sm dark:text-white">
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {content ? (
              formatLinks(content)
            ) : (
              <span className="italic text-[color:rgb(0_0_0_/_0.4)] dark:text-white/60">
                {t("emptyBubble")}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[color:rgb(0_0_0_/_0.5)] dark:text-white/60">
            <span>{now}</span>
            {content ? (
              <CheckCheck
                className="size-3.5 text-accent-400"
                aria-hidden="true"
              />
            ) : (
              <Check className="size-3.5" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
