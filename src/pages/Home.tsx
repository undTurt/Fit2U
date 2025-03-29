import { Link } from 'react-router-dom';
import { Shirt, Calendar, Brain, BarChart3, Users, ShoppingBag } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: Shirt,
      title: 'Digital Closet',
      description: 'Organize and manage your wardrobe digitally',
    },
    {
      icon: Calendar,
      title: 'Outfit Planning',
      description: 'Plan and schedule your outfits with ease',
    },
    {
      icon: Brain,
      title: 'AI Recommendations',
      description: 'Get personalized style suggestions',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track your wardrobe statistics and insights',
    },
    {
      icon: Users,
      title: 'Social Features',
      description: 'Share and discover styles with others',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Buy and sell fashion items securely',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Your Smart Wardrobe Assistant
        </h1>
        <p className="text-xl mb-8">
          Organize, plan, and elevate your style with AI-powered insights
        </p>
        <Link
          to="/closet"
          className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
        >
          Get Started
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;