import { Link } from 'react-router-dom';
import { Calendar, Users, CheckSquare, Zap } from 'lucide-react';

const Welcome = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create, organize, and manage events with ease'
    },
    {
      icon: CheckSquare,
      title: 'Task Tracking',
      description: 'Assign and track tasks efficiently for your team'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless coordination between students and admins'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay informed with instant notifications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">EventHub</h1>
          <div className="space-x-4">
            <Link
              to="/admin"
              className="px-4 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/student"
              className="px-4 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Student
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-100px)] flex items-center justify-center text-white px-6 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Welcome to EventHub
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              The modern platform for seamless event management and team collaboration. Perfect for students and administrators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to="/admin-login"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Admin Login
            </Link>
            <Link
              to="/student-login"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Student Login
            </Link>
          </div>

          <p className="text-gray-400 text-sm">Login to access your dashboard</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl hover:border-blue-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="mb-4 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur border border-blue-400/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8">Join thousands of event organizers and teams managing their events efficiently.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
              >
                Admin Access
              </Link>
              <Link
                to="/student"
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors"
              >
                Student Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-8 px-6 text-center text-gray-400">
        <p>&copy; 2024 EventHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
