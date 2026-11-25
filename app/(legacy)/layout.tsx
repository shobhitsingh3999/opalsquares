import type { Metadata, Viewport } from "next";
import headElements from "@/content/head.json";
import attrs from "@/content/attrs.json";

export const metadata: Metadata = {
  title: "opalsquare",
  robots: { "max-image-preview": "large" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

type HeadEl = { tag: string; attrs: Record<string, string>; html?: string };

// Map raw HTML attribute names to React prop names.
function toProps(a: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(a)) {
    if (k === "class") out.className = v;
    else if (k === "crossorigin") out.crossOrigin = v;
    else out[k] = v;
  }
  return out;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={attrs.html.class} suppressHydrationWarning>
      <head>
        {(headElements as HeadEl[]).map((el, i) => {
          const props = toProps(el.attrs);
          if (el.tag === "style") {
            return (
              <style
                key={i}
                {...props}
                dangerouslySetInnerHTML={{ __html: el.html ?? "" }}
              />
            );
          }
          if (el.tag === "link") return <link key={i} {...props} />;
          return null;
        })}
      </head>
      <body className={attrs.body.class} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
