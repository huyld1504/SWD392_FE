import { Shield, Award, BarChart3, CheckCircle } from 'lucide-react';

export function ForTeachers() {
  const benefits = [
    {
      icon: Shield,
      title: 'Moderate shared content quickly',
      description: 'Review and approve documents with a streamlined interface. Add feedback notes to guide students.',
    },
    {
      icon: Award,
      title: 'Highlight high-quality documents',
      description: 'Recognize exceptional work and set examples for other students to follow.',
    },
    {
      icon: BarChart3,
      title: 'Track top contributing students',
      description: 'View monthly stats and xu point leaderboards to identify engaged learners.',
    },
  ];

  return (
    <section id="for-teachers" className="py-24 bg-gradient-to-br from-teal-50 to-purple-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              For Educators
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built for teachers, too.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our platform gives you the tools to maintain quality while empowering student-led learning.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">Review Queue</h3>
                    <p className="text-sm text-white/80 mt-1">3 documents pending review</p>
                  </div>

                  {/* Stats card in header */}
                  <div className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[140px]">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">This month</p>
                      <p className="text-lg font-bold text-gray-900">127</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document list */}
              <div className="divide-y divide-gray-200">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">Quantum Mechanics - Wave Functions</h4>
                      <p className="text-xs text-gray-500 mt-1">By Alex Chen • Physics</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors">
                      Review
                    </button>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">Linear Algebra - Eigenvalues</h4>
                      <p className="text-xs text-gray-500 mt-1">By Sarah Kim • Mathematics</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors">
                      Review
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">Organic Chemistry - Reactions</h4>
                      <p className="text-xs text-gray-500 mt-1">By Marcus Li • Chemistry</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Great work! Very clear explanations.</p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}