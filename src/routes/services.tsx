import { Container } from "@/components/container";

const services = [
  {
    title: "AI Mock Interviews",
    desc: "Practice realistic interviews with dynamic questions across roles and levels.",
  },
  {
    title: "Instant Feedback",
    desc: "Get structured feedback and tips to improve clarity, correctness, and confidence.",
  },
  {
    title: "Question Bank",
    desc: "Access curated questions for frontend, backend, full-stack, data, and more.",
  },
  {
    title: "Progress Tracking",
    desc: "Track performance over time with reports and targeted recommendations.",
  },
  {
    title: "Career Guidance",
    desc: "Guided tracks and resources to help you prepare strategically.",
  },
];

export const ServicesPage = () => {
  return (
    <section className="w-full py-12 bg-white dark:bg-gray-900">
      <Container>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Services</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl">
            Everything you need to prepare confidently for your next interview.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="border rounded-lg p-5 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{s.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ServicesPage;