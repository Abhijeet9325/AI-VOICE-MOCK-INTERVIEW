import { Container } from "@/components/container";
import { Footer } from "@/components/footer";

import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-900">
      <Header />

      <Container className="flex-grow flex flex-col w-full">
        <main className="flex-grow flex flex-col w-full">
          <Outlet />
        </main>
      </Container>

      <Footer />
    </div>
  );
};
