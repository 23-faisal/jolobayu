import { type PropsWithChildren } from "react";
import Header from "../common/Header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="min-h-screen  container mx-auto px-4 py-8 ">
        {children}
      </main>
      <footer className="border-top backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center text-gray-400 ">
          Made with love by{" "}
          <a
            className={` text-blue-500`}
            href="https://www.linkedin.com/in/faisalahmed23/"
            target="_blank"
            rel="noopener noreferrer"
          >
            faisal
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
