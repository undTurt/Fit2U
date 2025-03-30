import { Link } from 'react-router-dom';
import { RefreshCw, Search, DollarSign, Palette, CloudRain, User } from 'lucide-react';
import RotatingText from '../components/RotatingText'; // Import the RotatingText component

function Home() {
  const features = [
    {
      icon: RefreshCw,
      title: 'Swipe and Swap',
      description:
        'Sustainable clothing exchange where you can swipe left or right on available clothes from others in your community. AI suggests the best trade matches based on size, style, and wardrobe gaps.',
    },
    {
      icon: Search,
      title: 'Clothing Search and Smart Sizing Assistant',
      description:
        'Find items online to complement your wardrobe. Smart sizing filters adjust recommendations based on brand-specific size variations and customer reviews.',
    },
    {
      icon: DollarSign,
      title: 'Budget Tracker for Smart Shopping',
      description:
        'Set a monthly clothing budget, and AI suggests affordable fashion pieces within your budget. Integrates discounts and second-hand alternatives to maximize savings.',
    },
    {
      icon: Palette,
      title: 'Personalized Fashion by Skin Tone & Body Type',
      description:
        'AI analyzes your skin tone and body type to recommend the most flattering colors and silhouettes. Explore AI-generated style guides tailored to your unique features.',
    },
    {
      icon: CloudRain,
      title: 'Weather & Location-Based Outfit Recommendations',
      description:
        'AI selects outfits based on real-time weather conditions and adjusts recommendations based on location and event type, such as office, party, or vacation.',
    },
    {
      icon: User,
      title: 'Body Type Outfit Recommendations',
      description:
        'AI selects outfits based on your body type and provides advice on the best fits. Adjusts recommendations based on the fit of clothes.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFFBE4]">
      {/* Hero Section */}
      <div className="text-center py-16 bg-[#1C2541] text-[#F2EDEB]">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Rotating Text */}
          <h1 className="text-4xl font-bold flex items-center space-x-2">
            <span className="relative left-[-10px]">Your</span>
            <RotatingText
              texts={['Style', 'Wardrobe', 'Impact', 'Expression', 'Schedule']}
              mainClassName="px-2 sm:px-2 md:px-3 bg-[#B76D68] text-[#F2EDEB] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2700}
            />
          </h1>
          <p className="text-xl">
            Organize, plan, and elevate your style with AI-powered insights
          </p>
        </div>
      </div>

      {/* Digital Closet Button */}
      <div className="text-center py-8 bg-[#FFFBE4]">
        <Link
          to="/closet"
          className="bg-[#1C2541] text-[#F2EDEB] px-8 py-3 rounded-full font-semibold hover:bg-[#B76D68] transition-colors"
        >
          Open Your My Wardrobe
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#FFFFF p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-[#1C2541] mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-black">{feature.title}</h2>
              <p className="text-black">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;