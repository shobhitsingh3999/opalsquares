import fs from "node:fs";
import path from "node:path";
import attrs from "@/content/attrs.json";
import SiteScripts from "./SiteScripts";

// Exact markup of the original homepage (everything inside #pxl-wapper).
const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "content", "body.html"),
  "utf8",
);

export default function Home() {
  return (
    <>
      <div
        id={attrs.wrapper.id}
        className={attrs.wrapper.class}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      <SiteScripts />
    </>
  );
}
