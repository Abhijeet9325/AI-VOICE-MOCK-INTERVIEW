import { Container } from "./container";
import { BookOpen, Target, Zap, Award, TrendingUp, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Course Library",
      description: "Access 100+ interview preparation courses covering all major tech stacks and roles.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on specific skills and technologies with our targeted mock interview sessions.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get real-time AI-powered feedback on your answers and performance metrics.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Certification Ready",
      description: "Prepare for industry certifications with our specialized interview tracks.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and performance insights.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join our community of 500K+ learners and get peer support and guidance.",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We provide everything you need to ace your technical interviews and land your dream job.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-slate-700"
            >
              {/* Icon Background */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold">
            <Award className="w-5 h-5" />
            <span>Trusted by 500K+ Students Worldwide</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;