import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is it free for students?',
      answer: 'Yes! StudyShare is completely free for students. We believe knowledge sharing should be accessible to everyone. Teachers and institutions may have premium features available.',
    },
    {
      question: 'How are xu points calculated?',
      answer: 'You earn xu points when: (1) your document gets approved by a teacher, (2) other students upvote your document, (3) you post helpful comments, and (4) you maintain high engagement. Top contributors are featured on monthly leaderboards.',
    },
    {
      question: 'Can I upload images and code snippets?',
      answer: 'Absolutely! Our block-based editor supports multiple content types including text paragraphs, headings, images, code blocks with syntax highlighting, math equations, and more. You can mix and match them to create rich study materials.',
    },
    {
      question: 'How do teachers approve documents?',
      answer: 'When you submit a document, it enters a review queue. Teachers can see all pending documents, review the content, and either approve it, reject it with feedback, or request specific changes. You\'ll be notified of the decision with any comments from the teacher.',
    },
    {
      question: 'Can I collaborate with other students on documents?',
      answer: 'Currently, each document has a single author, but you can work together through comments! Students can ask questions, suggest improvements, and discuss concepts in the threaded comment system under each document.',
    },
    {
      question: 'What subjects are supported?',
      answer: 'We support 50+ subjects across high school and university levels, including Mathematics, Physics, Chemistry, Biology, Computer Science, Economics, and more. If your subject isn\'t listed, you can request it to be added.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about StudyShare
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-left">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
