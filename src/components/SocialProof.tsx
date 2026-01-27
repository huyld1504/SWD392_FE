import { FileText, BookOpen, MessageCircle, Users } from 'lucide-react';

export function SocialProof() {
  const stats = [
    { icon: FileText, label: 'Documents shared', value: '15,000+' },
    { icon: BookOpen, label: 'Subjects covered', value: '50+' },
    { icon: MessageCircle, label: 'Comments posted', value: '42,000+' },
    { icon: Users, label: 'Active students', value: '12,000+' },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 rounded-lg mb-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
