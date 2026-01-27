import { FileEdit, Upload, CheckSquare, Award } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: FileEdit,
      number: '01',
      title: 'Select subject and create document',
      description: 'Choose your subject, topic, and lecture. Start a new document in our block-based editor.',
    },
    {
      icon: Upload,
      number: '02',
      title: 'Write content and submit for review',
      description: 'Add headings, paragraphs, images, code blocks, and more. Submit your document when ready.',
    },
    {
      icon: CheckSquare,
      number: '03',
      title: 'Teacher reviews and approves',
      description: 'A teacher reviews your work, provides feedback, and either approves or requests changes.',
    },
    {
      icon: Award,
      number: '04',
      title: 'Go live and earn xu points',
      description: 'Once approved, your document is visible to everyone. Students comment, ask questions, and you earn xu.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From creation to collaboration in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-200 via-purple-200 to-green-200"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step card */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white border-2 border-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <step.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-200">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
