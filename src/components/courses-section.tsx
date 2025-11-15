import { Container } from "./container";
import { ArrowRight, Clock, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursesSection = () => {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Software Engineer Interview",
      description: "Master data structures, algorithms, and system design for top tech companies.",
      duration: "8 weeks",
      rating: 4.9,
      students: "125K+",
      level: "Beginner to Advanced",
      color: "from-blue-600 to-cyan-600",
      icon: "💻"
    },
    {
      title: "Frontend Developer Interview",
      description: "React, JavaScript, CSS, and modern web development concepts.",
      duration: "6 weeks",
      rating: 4.8,
      students: "95K+",
      level: "Intermediate",
      color: "from-purple-600 to-pink-600",
      icon: "🎨"
    },
    {
      title: "Backend Developer Interview",
      description: "Node.js, databases, APIs, and server-side architecture.",
      duration: "7 weeks",
      rating: 4.9,
      students: "80K+",
      level: "Intermediate to Advanced",
      color: "from-green-600 to-emerald-600",
      icon: "⚙️"
    },
    {
      title: "Full Stack Developer Interview",
      description: "Complete web development from frontend to backend and deployment.",
      duration: "10 weeks",
      rating: 4.7,
      students: "110K+",
      level: "Advanced",
      color: "from-orange-600 to-red-600",
      icon: "🚀"
    },
    {
      title: "Data Scientist Interview",
      description: "Python, machine learning, statistics, and data analysis.",
      duration: "9 weeks",
      rating: 4.8,
      students: "65K+",
      level: "Intermediate",
      color: "from-indigo-600 to-blue-600",
      icon: "📊"
    },
    {
      title: "DevOps Engineer Interview",
      description: "Cloud, CI/CD, Docker, Kubernetes, and infrastructure management.",
      duration: "8 weeks",
      rating: 4.6,
      students: "45K+",
      level: "Advanced",
      color: "from-teal-600 to-cyan-600",
      icon: "☁️"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Interview Preparation Tracks
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our comprehensive interview preparation courses designed by industry experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-slate-700 overflow-hidden"
            >
              {/* Course Header */}
              <div className={`h-32 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 p-6 h-full flex items-center justify-between">
                  <div>
                    <div className="text-4xl mb-2">{course.icon}</div>
                    <div className="text-white/80 text-sm font-medium">{course.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-white mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                    <div className="text-white/70 text-xs">{course.students} students</div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Course Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-500 font-medium">Start Learning</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full bg-gradient-to-r ${course.color} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105`}
                >
                  Enroll Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Courses Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/generate")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            View All Interview Tracks
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default CoursesSection;