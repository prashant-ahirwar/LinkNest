import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLink, FiBarChart2, FiLayout, FiZap } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🔗</div>
              <h1 className="text-2xl font-bold text-gray-900">LinkNest</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            One link for
            <span className="text-primary-600"> everything</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Share all your links in one beautiful page. Perfect for creators, freelancers,
            and anyone who wants to simplify their online presence.
          </p>
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Create Your LinkNest →
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: FiLink,
              title: 'Unlimited Links',
              description: 'Add as many links as you want. No limits.',
            },
            {
              icon: FiLayout,
              title: 'Custom Themes',
              description: 'Make it yours with colors, fonts, and styles.',
            },
            {
              icon: FiBarChart2,
              title: 'Analytics',
              description: 'Track views and clicks to understand your audience.',
            },
            {
              icon: FiZap,
              title: 'Lightning Fast',
              description: 'Built for speed. Your page loads instantly.',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div
                  className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                >
                  <Icon className="text-primary-600" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators sharing their links with LinkNest
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2026 LinkNest. Built with ❤️ for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
