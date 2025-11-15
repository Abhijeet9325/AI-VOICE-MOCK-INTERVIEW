import { Container } from "@/components/container";

export const ContactPage = () => {
  return (
    <section className="w-full py-12 bg-white dark:bg-gray-900">
      <Container>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Us</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Have questions or feedback? We’d love to hear from you.
          </p>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Email: <a className="text-blue-600 dark:text-blue-400" href="mailto:support@aiinterview.com">support@aiinterview.com</a>
            </p>
            <p>
              Phone: <a className="text-blue-600 dark:text-blue-400" href="tel:+919325000000">+91 9325 000 000</a>
            </p>
            <p>Location: Tech City, India</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactPage;