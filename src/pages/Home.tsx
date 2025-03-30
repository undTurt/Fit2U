import { Link } from 'react-router-dom';
import { RefreshCw, Search, DollarSign, Palette, CloudRain, User } from 'lucide-react';
import RotatingText from '../components/RotatingText';
import SplitText from '../components/ReactBits/SplitText'; // Import SplitText

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

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFFFFF]">
      {/* Hero Section */}
      <div className="text-center py-24 md:py-32 bg-[#1C2541] text-[#F2EDEB]">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Rotating Text */}
          <h1 className="text-4xl font-bold flex items-center space-x-2">
            <span className="relative left-[-10px]">Your</span>
            <RotatingText
              texts={['Style', 'Wardrobe', 'Impact']}
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
          <SplitText
            text="Organize, plan, and elevate your style"
            className="text-xl"
            delay={30}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing={(t) => (--t * t * t + 1)} // Replace with a cubic easing function
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>
      </div>

      {/* Digital Closet Button */}
      <div className="text-center py-8 bg-[#FFFFFFF]">
        <Link
          to="/closet"
          className="bg-[#1C2541] text-[#F2EDEB] px-8 py-3 rounded-full font-semibold hover:bg-[#B76D68] transition-colors"
        >
          Open Your Digital Wardrobe
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#1C2541]">Our Features</h2>
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

      {/* Our Story Section */}
      <div className="bg-[#1C2541] text-[#F2EDEB] py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
            Our Story
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-justify md:text-center">
            <p className="max-w-4xl mx-auto">
              <span className="font-semibold">Fit2U</span> was born from a simple idea: fashion should be effortless, personal, and sustainable. 
              We saw a problem—people spend too much time picking outfits, struggle to find clothes that truly fit, 
              and often let great pieces go to waste. With fast fashion contributing to pollution and overflowing closets 
              filled with unworn items, we knew there had to be a better way.
            </p>
            <p className="max-w-4xl mx-auto">
              That’s why we created <span className="font-semibold">Fit2U</span>—a smart styling assistant that not only helps you curate the perfect wardrobe 
              but also makes shopping smarter and more sustainable. Our <span className="italic">Style & Swap</span> feature gives clothes a second life, 
              reducing waste while connecting people within their communities. Our smart shopping tool ensures that new 
              purchases truly fit your style, budget, and existing wardrobe.
            </p>
            <p className="max-w-4xl mx-auto">
              We believe that fashion should work for you—not the other way around. By combining personalization, 
              sustainability, and convenience, we aim to transform how people shop, style, and swap for a future where 
              looking good doesn’t come at the cost of the planet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;