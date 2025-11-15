import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./container";

const HeroSection = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const stats = [
    { icon: Users, value: "500K+", label: "Students Trained" },
    { icon: Star, value: "5.0", label: "Rating" },
    { icon: Award, value: "100+", label: "Courses" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      <Container>
        <div className="relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">India's Most Loved Interview Prep Platform</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Master Your
                  <span className="block text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                    Dream Interview
                  </span>
                  with AI Power
                </h1>
                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Learn coding the right way with AI-assisted mock interviews. 
                  Practice with real-world questions, get instant feedback, and land 
                  your dream job faster than ever.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => (userId ? navigate("/generate") : navigate("/signin"))}
                >
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                  onClick={() => navigate("/generate")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button> */}
              </div>

              {/* Secondary CTA Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-4 font-medium rounded-xl transition-all duration-300"
                  onClick={() => navigate("/about")}
                >
                  About Us
                </Button> */}
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-4 font-medium rounded-xl transition-all duration-300"
                  onClick={() => navigate("/services")}
                >
                  Services
                </Button> */}
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-4 font-medium rounded-xl transition-all duration-300"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button> */}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image/Animation */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-3xl p-4 border border-white/20">
                {/* Hero Image */}
                <img
                  src="/assets/img/hero.jpg"
                  alt="AI Mock Interview"
                  className="rounded-2xl shadow-2xl w-full h-full object-cover"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;