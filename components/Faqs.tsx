import Link from "next/link";
import { site } from "@/site.config";
import { IconPlus } from "./Icons";

export default function Faqs({ limit, title = "Questions buyers ask us" }: { limit?: number; title?: string }) {
  const faqs = limit ? site.faqs.slice(0, limit) : site.faqs;
  return (
    <section className="section faqs" aria-labelledby="faqs-title">
      <div className="container faq-layout">
        <div className="faq-intro">
          <p className="kicker">FAQs</p>
          <h2 id="faqs-title" className="h2">{title}</h2>
          <p className="section-lead">
            Still unsure? <Link href="/contact#enquire">Ask an advisor</Link> and we will call you back.
          </p>
          {limit && site.faqs.length > limit && (
            <Link className="btn btn-outline faq-all" href="/faqs">See all FAQs</Link>
          )}
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={f.question} className="faq" open={i === 0}>
              <summary>
                <span>{f.question}</span>
                <IconPlus className="faq-icon" size={20} />
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
