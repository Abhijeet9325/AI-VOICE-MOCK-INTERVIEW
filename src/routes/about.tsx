import { Container } from "@/components/container";

export const AboutPage = () => {
  return (
    <section className="w-full py-12 bg-white dark:bg-gray-900">
      <Container>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About Us</h1>
          <p className="text-gray-700 dark:text-gray-300">
            AI Interview Prep helps students and professionals practice real interview scenarios
            with AI-generated questions, instant feedback, and actionable insights. Our mission is
            to make interview preparation accessible, effective, and engaging.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            With mock interviews, performance analytics, and tailored tracks, you can focus on the
            skills that matter most for your dream role.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default AboutPage;