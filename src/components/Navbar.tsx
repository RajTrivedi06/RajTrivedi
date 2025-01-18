import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo or site name */}
          <div className="text-xl font-bold text-purple-700">
            <Link to="/home">MyPortfolio</Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link
                to="/about"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/skills"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Skills
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/experience"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                to="/connect"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Connect
              </Link>
            </li>
          </ul>

          {/* Mobile Menu (optional): 
            You could add a hamburger icon here to toggle a mobile dropdown
          */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
