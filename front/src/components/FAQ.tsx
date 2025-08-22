import React from "react";

const faqData = [
  {
    question: "How can I support a funding plan?",
    answer:
      "Click on 'Subscribe Now' for any active plan and follow the payment steps.",
  },
  {
    question: "Can I create my own funding plan?",
    answer:
      "Yes, registered users can create new funding plans from the dashboard.",
  },
  {
    question: "Is my donation secure?",
    answer: "We use secure payment gateways to ensure your transaction safety.",
  },
];

const FAQ: React.FC = () => (
  <section style={{ marginTop: 40 }}>
    <h2>Frequently Asked Questions</h2>
    <div>
      {faqData.map(({ question, answer }, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <strong>{question}</strong>
          <p>{answer}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FAQ;
