"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { quoteUsable, type TaoQuote } from "../lib/fx-price";

const universityCourses = [
  {
    number: "01",
    title: "Bittensor Subnets 101",
    tag: "Foundation",
    bestFor: "Best for Bittensor beginners",
    description: "Understand miners, validators, emissions, alpha, subnet economics, and how the Bittensor network fits together.",
    outcome: "Leave with a practical framework for evaluating what a subnet actually does.",
    lessons: ["How subnets work", "Reading emissions and incentives", "Finding real utility"],
  },
  {
    number: "02",
    title: "Build the Best Subnet Portfolio",
    tag: "Portfolio",
    bestFor: "Best for active subnet investors",
    description: "Turn subnet research into a focused portfolio built around conviction, sizing, risk, and a repeatable decision process.",
    outcome: "Leave with a clearer research, sizing, and portfolio-review process.",
    lessons: ["Subnet research framework", "Position sizing and risk", "Portfolio reviews"],
  },
  {
    number: "03",
    title: "Content Creation Strategies",
    tag: "Creator",
    bestFor: "Best for creators and founders",
    description: "Learn Shizzy’s system for finding ideas, building authority, packaging stories, and publishing content people actually watch.",
    outcome: "Leave with a repeatable content workflow you can begin using immediately.",
    lessons: ["Ideas that earn attention", "Titles, hooks, and structure", "Consistent publishing"],
  },
  {
    number: "04",
    title: "Crypto Security & Wallet Safety",
    tag: "Security",
    bestFor: "Best for protecting digital assets",
    description: "Protect your TAO and digital assets with practical wallet separation, transaction hygiene, and scam-resistant habits.",
    outcome: "Leave with a personal wallet-safety checklist and stronger transaction habits.",
    lessons: ["Cold and hot wallet setup", "Transaction safety", "Threats and recovery plans"],
  },
];
const stripeCheckout = "https://buy.stripe.com/fZudRb3u5dkA7Y45RNfAc00";
const universityCalendly = "https://calendly.com/shizzyunchained/shiz-university";
const universityWallet = "5Gsp2ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM";
const fmt = (value: number, digits = 2) => value.toLocaleString("en-US", { maximumFractionDigits: digits });
export function UniversityContent() {
 const [checkoutCourse, setCheckoutCourse] = useState<(typeof universityCourses)[number] | null>(null);
 const [walletCopied, setWalletCopied] = useState(false);
 const [quote, setQuote] = useState<TaoQuote | null>(null);
 const [now, setNow] = useState(() => Date.now());
 useEffect(() => {
  const controller = new AbortController();
  let inFlight = false;
  const refresh = async () => {
   setNow(Date.now());
   if (document.hidden || inFlight) return;
   inFlight = true;
   try { const result = await fetch("/api/tao-price", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) }); if (result.ok) { const next = await result.json(); if (!controller.signal.aborted) setQuote(next); } } catch { /* Existing quote expires; unavailable prices remain explicit. */ } finally { inFlight = false; }
  };
  void refresh(); const timer = window.setInterval(refresh, 30000);
  document.addEventListener("visibilitychange", refresh);
  return () => { controller.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
 }, []);
 const taoUsd = quoteUsable(quote, now) ? quote!.usd : 0;
 return (
        <section className="university-page">
          <div className="university-hero">
            <div className="university-copy">
              <p className="eyebrow">Private education · Real experience</p>
              <h1>
                Private strategy sessions.
                <br />
                <span>Built around you.</span>
              </h1>
              <p>Choose one focused, one-on-one class with Shizzy covering Bittensor, portfolio construction, content, or crypto security. Bring your questions and leave with a clearer, practical next step.</p>
              <div className="university-actions">
                <a className="university-primary" href="#classes">
                  Choose your class →
                </a>
                <a className="university-secondary" href="#how-it-works">
                  How it works
                </a>
              </div>
              <div className="university-proof">
                <span>
                  <b>$100</b> per session
                </span>
                <span>
                  <b>Private</b> 1-on-1
                </span>
                <span>
                  <b>Card or TAO</b> payment
                </span>
              </div>
            </div>
            <Image src="/shiz-university-v2.webp" alt="Shiz University" width={820} height={788} sizes="(max-width: 600px) 86vw, 410px" />
          </div>
          <section className="university-trust" aria-label="Why learn with Shizzy">
            <div>
              <strong>Real market experience</strong>
              <span>Lessons shaped by ongoing Bittensor research and participation.</span>
            </div>
            <div>
              <strong>Your questions first</strong>
              <span>A private conversation focused on where you need the most clarity.</span>
            </div>
            <div>
              <strong>Practical takeaways</strong>
              <span>Frameworks and next steps designed to be useful after the session.</span>
            </div>
          </section>
          <div className="course-heading" id="classes">
            <div>
              <p className="eyebrow">Choose your class</p>
              <h2>Pick your focus</h2>
            </div>
            <p>Start with the session that matches your current goal. You can always book another topic later.</p>
          </div>
          <div className="course-grid">
            {universityCourses.map((course) => (
              <article className="course-card panel" key={course.number}>
                <div className="course-top">
                  <span>{course.number}</span>
                  <em>{course.tag}</em>
                </div>
                <small className="course-best">{course.bestFor}</small>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-outcome">
                  <b>Your takeaway</b>
                  <span>{course.outcome}</span>
                </div>
                <ul>
                  {course.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
                <div className="course-foot">
                  <div>
                    <strong>$100</strong>
                    <small>Private session</small>
                  </div>
                  <button
                    onClick={() => {
                      setCheckoutCourse(course);
                      setWalletCopied(false);
                    }}
                  >
                    Book this session →
                  </button>
                </div>
              </article>
            ))}
          </div>
          <section className="university-process" id="how-it-works">
            <div className="course-heading">
              <div>
                <p className="eyebrow">Simple booking</p>
                <h2>How it works</h2>
              </div>
              <p>Choose your topic, complete payment, and coordinate your private session directly.</p>
            </div>
            <div className="process-grid">
              {[
                ["01", "Choose a class", "Select the topic that best matches your current goal."],
                ["02", "Pay securely", "Use the card checkout or pay the live $100 equivalent in TAO."],
                ["03", "Send your details", "TAO buyers submit their transaction confirmation and preferred class."],
                ["04", "Meet with Shizzy", "Join your private session ready with your goals and questions."],
              ].map((step) => (
                <div key={step[0]}>
                  <span>{step[0]}</span>
                  <strong>{step[1]}</strong>
                  <p>{step[2]}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="university-about">
            <Image src="/about-shizzy.png" alt="Shizzy Unchained" width={2000} height={2000} sizes="(max-width: 700px) 100vw, 50vw" />
            <div>
              <p className="eyebrow">Your instructor</p>
              <h2>Learn directly from Shizzy</h2>
              <p>Shizzy Unchained creates practical Bittensor market coverage, subnet deep dives, interviews, and educational content. These sessions bring that same direct approach into a private conversation centered on your questions.</p>
              <div>
                <span>Bittensor research</span>
                <span>Subnet deep dives</span>
                <span>Creator experience</span>
              </div>
            </div>
          </section>
          <section className="university-faq">
            <div className="course-heading">
              <div>
                <p className="eyebrow">Before you book</p>
                <h2>Frequently asked questions</h2>
              </div>
            </div>
            <div>
              {[
                ["Do I need Bittensor experience?", "No. Choose Subnets 101 if you are beginning, or select another class if you already have a specific goal."],
                ["Can I pay with TAO?", "Yes. The checkout shows the live TAO equivalent of $100 and the wallet address. Submit your transaction confirmation afterward."],
                ["Is this financial advice?", "No. Sessions provide education, perspective, and personal guidance. Every financial decision remains your responsibility."],
                ["Can the session cover my specific questions?", "Yes. The one-on-one format is designed around your goals, while staying within the selected class topic."],
                ["What happens after payment?", "Card buyers continue through the secure checkout. TAO buyers receive instructions to submit payment confirmation and coordinate their class."],
              ].map((item) => (
                <details key={item[0]}>
                  <summary>{item[0]}</summary>
                  <p>{item[1]}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="university-final">
            <p className="eyebrow">Ready when you are</p>
            <h2>Choose the skill you want to sharpen.</h2>
            <p>Book one focused private session and bring the questions that matter most to you.</p>
            <a href="#classes">View the classes →</a>
          </section>
          <div className="university-note">
            <span>Education, perspective, and personal guidance.</span>
            <p>Nothing here is financial or life advice. Every decision remains yours.</p>
          </div>
          {checkoutCourse && (
            <div
              className="checkout-backdrop"
              role="presentation"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setCheckoutCourse(null);
              }}
            >
              <section className="course-checkout panel" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
                <button className="checkout-close" aria-label="Close checkout" onClick={() => setCheckoutCourse(null)}>
                  ×
                </button>
                <p className="eyebrow">Shiz University enrollment</p>
                <h2 id="checkout-title">{checkoutCourse.title}</h2>
                <div className="checkout-price">
                  <strong>$100</strong>
                  <span>One private class</span>
                </div>
                <a className="card-checkout" href={stripeCheckout} target="_blank" rel="noreferrer">
                  Pay securely with card →
                </a>
                <div className="checkout-divider">
                  <span>or pay with TAO</span>
                </div>
                <div className="tao-payment">
                  <div>
                    <span>Send exactly</span>
                    <strong>{taoUsd ? `${fmt(100 / taoUsd, 4)} TAO` : "$100 in TAO"}</strong>
                    <small>{taoUsd ? `Based on the current $${fmt(taoUsd)} TAO price` : "Use the live TAO price when sending"}</small>
                  </div>
                  <code>{universityWallet}</code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(universityWallet);
                      setWalletCopied(true);
                    }}
                  >
                    {walletCopied ? "Wallet copied ✓" : "Copy wallet address"}
                  </button>
                </div>
                <div className="schedule-step">
                  <span>After payment, schedule your class</span>
                  <p>Paid by card? Choose your time below. Paid with TAO? Include your transaction hash or confirmation in the booking form so payment can be verified.</p>
                  <a className="card-checkout" href={universityCalendly} target="_blank" rel="noreferrer">
                    Open scheduling calendar →
                  </a>
                  <b>TAO bookings without transaction confirmation will not be accepted.</b>
                </div>
              </section>
            </div>
          )}
        </section>
);
}
