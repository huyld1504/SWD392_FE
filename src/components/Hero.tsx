import { FileText, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentMockup } from './DocumentMockup';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-white via-teal-50/30 to-purple-50/20 pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              <FileText className="w-4 h-4 mr-2" />
              Built for students and teachers
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Share smarter study documents.{' '}
              <span className="text-teal-600">Get rewarded</span> for helping others.
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              A collaborative learning platform where students share study notes and solutions, 
              teachers ensure quality through review, and contributors earn xu points for their help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start sharing documents
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-teal-600 hover:text-teal-600 transition-all">
                <Play className="mr-2 w-5 h-5" />
                View sample document
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
              </div>
              <p className="text-sm text-gray-600">
                Join <span className="font-semibold text-gray-900">12,000+</span> students already sharing knowledge
              </p>
            </div>
          </div>

          {/* Right Column - Mockup */}
          <div className="relative">
            <DocumentMockup />
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}