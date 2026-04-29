import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OpenZap — WhatsApp link & QR code generator";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ImageResponse> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const app = await getTranslations({ locale, namespace: "app" });

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background:
          "linear-gradient(135deg, #075E54 0%, #128C7E 55%, #25D366 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
          }}
        >
          ✓
        </div>
        <div>{app("name")}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 960,
            letterSpacing: "-0.02em",
          }}
        >
          {t("title").replace("OpenZap — ", "")}
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            maxWidth: 960,
            lineHeight: 1.35,
          }}
        >
          {t("description")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          opacity: 0.8,
        }}
      >
        <div>openzap.app</div>
        <div>Free · No sign-up · Privacy-first</div>
      </div>
    </div>,
    { ...size },
  );
}
