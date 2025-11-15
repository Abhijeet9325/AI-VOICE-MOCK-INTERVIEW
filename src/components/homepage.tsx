import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import LogoCarousel from "./logo-carousel";
import TestimonialsSection from "./testimonials-section";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <LogoCarousel />
      <TestimonialsSection />
    </div>
  );
};

export default Homepage;