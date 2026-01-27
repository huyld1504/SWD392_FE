import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const navigation = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How it works', href: '#how-it-works' },
      { name: 'For Teachers', href: '#for-teachers' },
      { name: 'Pricing', href: '#pricing' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo and mission */}
          <div className="col-span-2">
            <a href="/" className="text-2xl font-semibold text-white mb-4 block">
              StudyShare
            </a>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Empowering students to share knowledge and learn together. 
              Built for the next generation of collaborative learning.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm hover:text-teal-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm hover:text-teal-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm hover:text-teal-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm hover:text-teal-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 StudyShare. Made for students and teachers.
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ for collaborative learning
          </p>
        </div>
      </div>
    </footer>
  );
}
