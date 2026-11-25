import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="26 November 2026"
      sections={[
        {
          heading: "Information on this website",
          body: [
            "Project details, prices, carpet areas, possession dates and images are provided for general information and are subject to change by the developer without notice.",
            "Prices shown are indicative starting figures. The final cost may include GST, stamp duty, registration, parking, maintenance and other charges set by the developer.",
          ],
        },
        {
          heading: "Not an offer",
          body: ["Nothing on this website is an offer or a contract. Please rely on the developer's official documents, cost sheet and RERA registration before making any payment."],
        },
        {
          heading: "Site visits",
          body: ["A preferred date submitted through the website is a request. A visit is confirmed only when an advisor confirms it with you directly."],
        },
        {
          heading: "Third-party links",
          body: ["Links to RERA portals, maps, WhatsApp or social media take you to services we do not control."],
        },
      ]}
    />
  );
}
