import { Blocks, CheckCircle, MessageCircle, Coins } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Blocks,
      title: 'Block-based editor for study documents',
      description: 'Create rich, structured content with support for headings, paragraphs, images, code blocks, and more. Just like Notion, but built for learning.',
      color: 'teal',
    },
    {
      icon: CheckCircle,
      title: 'Teacher approval and quality control',
      description: 'Teachers review every document before it goes live. They can approve, reject, or request changes with detailed feedback notes.',
      color: 'purple',
    },
    {
      icon: MessageCircle,
      title: 'Comment and discuss like a social network',
      description: 'Threaded comments with nested replies let students break down complex problems together and ask questions directly on documents.',
      color: 'blue',
    },
    {
      icon: Coins,
      title: 'Earn xu for your contributions',
      description: 'Your wallet tracks rewards for creating high-quality documents and posting helpful comments. Top contributors get recognized monthly.',
      color: 'green',
    },
  ];

  const colorMap = {
    teal: {
      bg: 'bg-teal-100',
      text: 'text-teal-600',
      gradient: 'from-teal-500 to-teal-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
    },
  };

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to share knowledge
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A powerful platform that brings students and teachers together for collaborative learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color as keyof typeof colorMap];
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
