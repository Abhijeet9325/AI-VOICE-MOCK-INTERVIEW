import { Container } from "./container";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer at Google",
      content: "This platform transformed my interview preparation. The AI-generated questions were incredibly realistic and the instant feedback helped me improve significantly. I landed my dream job at Google!",
      rating: 5,
      image: "👨‍💻",
      company: "Google"
    },
    {
      name: "Priya Patel",
      role: "Frontend Developer at Microsoft",
      content: "The comprehensive course structure and practical mock interviews gave me the confidence I needed. The community support is amazing and the instructors are always ready to help.",
      rating: 5,
      image: "👩‍💻",
      company: "Microsoft"
    },
    {
      name: "Amit Kumar",
      role: "Full Stack Developer at Amazon",
      content: "Best investment I made for my career. The targeted practice sessions and detailed analytics helped me identify my weak areas and improve them systematically.",
      rating: 5,
      image: "👨‍🚀",
      company: "Amazon"
    },
    {
      name: "Sneha Reddy",
      role: "Data Scientist at Meta",
      content: "The AI-powered mock interviews are incredibly realistic. I practiced for 2 months and saw a dramatic improvement in my technical interview performance.",
      rating: 5,
      image: "👩‍🔬",
      company: "Meta"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Success Stories from Our Students
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of students who have landed their dream jobs with our interview preparation platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-600 group-hover:text-blue-400 transition-colors duration-300">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{testimonial.company}</div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">500K+</div>
            <div className="text-gray-600 dark:text-gray-400">Students Trained</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">4.9</div>
            <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">6</div>
            <div className="text-gray-600 dark:text-gray-400">Months Avg. Job Landing</div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;