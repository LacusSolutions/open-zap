"use client";

import {
  CircleEllipsis,
  Code2,
  Globe2,
  Link as LinkIcon,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactElement, type ReactNode, useMemo } from "react";

import { Combobox, type ComboboxItem } from "@/components/ui/Combobox";
import { LINK_VARIANTS, type LinkVariant } from "@/lib/whatsapp";

interface VariantComboboxProps {
  id?: string;
  onChange: (variant: LinkVariant) => void;
  value: LinkVariant;
}

const ICONS: Record<LinkVariant, ReactNode> = {
  wa: <LinkIcon className="size-4" aria-hidden="true" />,
  api: <Code2 className="size-4" aria-hidden="true" />,
  deepLink: <MessageCircle className="size-4" aria-hidden="true" />,
  web: <Globe2 className="size-4" aria-hidden="true" />,
  call: <Phone className="size-4" aria-hidden="true" />,
  share: <Share2 className="size-4" aria-hidden="true" />,
  shortCode: <CircleEllipsis className="size-4" aria-hidden="true" />,
};

export function VariantCombobox({
  value,
  onChange,
  id,
}: VariantComboboxProps): ReactElement {
  const tVariants = useTranslations("variants");
  const tCombobox = useTranslations("variants.combobox");

  const items = useMemo<ComboboxItem<LinkVariant>[]>(
    () =>
      LINK_VARIANTS.map((variant) => ({
        value: variant,
        label: tVariants(`${variant}.label`),
        description: tVariants(`${variant}.description`),
        icon: ICONS[variant],
      })),
    [tVariants],
  );

  return (
    <Combobox<LinkVariant>
      id={id}
      items={items}
      value={value}
      onValueChange={onChange}
      ariaLabel={tCombobox("ariaLabel")}
      placeholder={tCombobox("placeholder")}
      showSearch={false}
    />
  );
}
