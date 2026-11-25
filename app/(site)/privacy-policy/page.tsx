import type { Metadata } from "next";
import { site } from "@/site.config";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

const contactLine = site.contact.email
  ? `write to ${site.contact.email}`
  : site.contact.whatsapp
    ? `message us on WhatsApp at ${site.contact.whatsapp}`
    : "contact us through the website";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="26 November 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you request a site visit we collect your name, mobile number, the property you are interested in and, if you give one, your preferred date.",
            "If you message us on WhatsApp, we receive the details you choose to share in that conversation.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "We use your details only to respond to your request: to call you, confirm a visit and share information about the projects you asked about.",
            "To arrange a visit we may share your name and number with the developer of that project.",
          ],
        },
        {
          heading: "How long we keep it",
          body: ["We keep enquiry details only for as long as needed to handle your request and meet legal obligations, then delete them."],
        },
        {
          heading: "Your choices",
          body: [
            `You can ask us to access, correct or delete your details at any time; ${contactLine}.`,
            "We handle personal data in line with India's Digital Personal Data Protection Act, 2023.",
          ],
        },
      ]}
    />
  );
}
