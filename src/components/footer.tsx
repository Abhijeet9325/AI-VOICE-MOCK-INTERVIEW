import React from "react";

import { Twitter, Instagram, Linkedin } from "lucide-react"; // Import Lucide icons
import { Link } from "react-router-dom";
import { Container } from "@/components/container";
import { MainRoutes } from "@/lib/helpers";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-300 transition-colors hover:scale-105 ${hoverColor}`}
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-300"
      >
        {children}
      </Link>
    </li>
  );
};

export const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First Column: Brand */}
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI Interview Prep
              </h2>
              <p className="text-gray-300 text-sm mt-2">
                India's Most Loved Interview Preparation Platform
              </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering 500K+ students to land their dream jobs with AI-assisted interview preparation.
            </p>
          </div>

          {/* Second Column: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-3">
              {MainRoutes.map((route) => (
                <FooterLink key={route.href} to={route.href}>
                  {route.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Third Column: Popular Courses */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-400">Popular Tracks</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/generate" className="text-gray-300 hover:text-white transition-colors">Software Engineer</Link></li>
              <li><Link to="/generate" className="text-gray-300 hover:text-white transition-colors">Frontend Developer</Link></li>
              <li><Link to="/generate" className="text-gray-300 hover:text-white transition-colors">Backend Developer</Link></li>
              <li><Link to="/generate" className="text-gray-300 hover:text-white transition-colors">Full Stack Developer</Link></li>
              <li><Link to="/generate" className="text-gray-300 hover:text-white transition-colors">Data Scientist</Link></li>
              <li><Link to="/generate" className="text-gray-300 hover:text-white transition-colors">DevOps Engineer</Link></li>
            </ul>
          </div>

          {/* Fourth Column: Contact & Social */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-blue-400">Get In Touch</h3>
            <div className="space-y-3 mb-6">
              <p className="text-gray-300 text-sm">
                📧 <a href="mailto:support@aiinterview.com" className="hover:text-blue-400 transition-colors">support@aiinterview.com</a>
              </p>
              <p className="text-gray-300 text-sm">
                📱 <a href="tel:+919876543210" className="hover:text-blue-400 transition-colors">+91 9325XXXXXX</a>
              </p>
              <p className="text-gray-300 text-sm">
                📍 Tech City, India
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3 text-blue-400">Follow Us</h4>
              <div className="flex gap-4">
                <SocialLink
                  href="https://youtube.com"
                  icon={<div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs">YT</div>}
                  hoverColor="hover:scale-110 transition-transform"
                />
                <SocialLink
                  href="https://twitter.com"
                  icon={<Twitter size={24} />}
                  hoverColor="hover:text-blue-400"
                />
                <SocialLink
                  href="https://linkedin.com"
                  icon={<Linkedin size={24} />}
                  hoverColor="hover:text-blue-700"
                />
                <SocialLink
                  href="https://instagram.com"
                  icon={<Instagram size={24} />}
                  hoverColor="hover:text-pink-500"
                />
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-blue-400">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 AI Interview Prep. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
