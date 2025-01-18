import React, { useEffect } from "react";
import { ShineBorder } from "@/components/ui/shine-border";

// Images
import ChatImage from "@/assets/ChatImage.png";
import HouseImage from "@/assets/houseimage.png";
import CourseSearchImage from "@/assets/coursesearchAI.jpg";
import ConnectCablesImage from "@/assets/connectcablesimage.jpg";

// Preload images into the cache
const preloadImages = (srcs: string[]) => {
  srcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    // Preload all images
    preloadImages([
      ChatImage,
      HouseImage,
      CourseSearchImage,
      ConnectCablesImage,
    ]);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black text-white px-4 py-8 sm:px-8 sm:py-12">
      {/* Heading (normal flow instead of absolute) */}
      <h1 className="text-4xl sm:text-6xl font-bold text-purple-600 mb-8">
        The Code Canvas
      </h1>

      {/* Responsive grid: 1 col on small, 2 on medium, 4 on large */}
      <div className="flex-grow-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* 1: BadgerChat Card */}
        <ShineBorder
          color="#9B5CFF"
          borderWidth={1.5}
          borderRadius={12}
          // Removed fixed width/height
          className="bg-black flex flex-col rounded-lg overflow-hidden !p-0 max-w-sm w-full mx-auto"
        >
          <img
            src={ChatImage}
            alt="BadgerChat"
            className="w-full h-48 object-cover"
          />
          <div className="flex-1 px-4 py-4 text-white flex flex-col justify-start">
            <h2 className="text-xl font-bold mb-2">BadgerChat</h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              B<strong>React Native</strong> and <strong>Expo</strong> for
              real-time chat functionality. It lets users register or log in
              with secure, token-based authentication, post and delete messages,
              and switch between chatrooms. The app features intuitive
              navigation, uses <strong>expo-secure-store</strong> for token
              storage, and includes a guest mode for read-only access,
              showcasing robust mobile development concepts.
            </p>
          </div>
        </ShineBorder>

        {/* 2: Dynamic Risk & Coverage Assessment Card */}
        <ShineBorder
          color="#9B5CFF"
          borderWidth={1.5}
          borderRadius={12}
          className="bg-black flex flex-col rounded-lg overflow-hidden !p-0 max-w-sm w-full mx-auto"
        >
          <img
            src={HouseImage}
            alt="Dynamic Risk & Coverage"
            className="w-full h-48 object-cover"
          />
          <div className="flex-1 px-4 py-4 text-white flex flex-col justify-start">
            <h2 className="text-xl font-bold mb-2">
              Dynamic Risk & Coverage Assessment (ongoing)
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Developed a web application using FastAPI for the backend and
              React with Radix UI for a professional, responsive frontend.
              Integrated external APIs and comprehensive housing market datasets
              to evaluate property insurance risks and deliver personalized
              coverage recommendations. Utilized pandas for efficient data
              processing, ensuring a seamless user experience.
            </p>
          </div>
        </ShineBorder>

        {/* 3: Course Search AI */}
        <ShineBorder
          color="#9B5CFF"
          borderWidth={1.5}
          borderRadius={12}
          className="bg-black flex flex-col rounded-lg overflow-hidden !p-0 max-w-sm w-full mx-auto"
        >
          <img
            src={CourseSearchImage}
            alt="Course Search AI"
            className="w-full h-48 object-cover"
          />
          <div className="flex-1 px-4 py-4 text-white flex flex-col justify-start">
            <h2 className="text-xl font-bold mb-2">
              Course Search AI (ongoing)
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Developed and integrated a specialized ChatGPT-based system for
              searching UW–Madison courses. This project leveraged advanced
              natural language processing, real-time data retrieval, and custom
              user-friendly interfaces to streamline course selection. The
              system improved search accuracy by analyzing course attributes,
              prerequisites, and scheduling details, ultimately enhancing
              students’ planning and registration experiences. Throughout
              development, user feedback guided iterative improvements.
            </p>
          </div>
        </ShineBorder>

        {/* 4: Connect Cables */}
        {/* <ShineBorder
          color="#9B5CFF"
          borderWidth={1.5}
          borderRadius={12}
          className="bg-black flex flex-col rounded-lg overflow-hidden !p-0 max-w-sm w-full mx-auto"
        >
          <img
            src={ConnectCablesImage}
            alt="Connect Cables"
            className="w-full h-48 object-cover"
          />
          <div className="flex-1 px-4 py-4 text-white flex flex-col justify-start">
            <h2 className="text-xl font-bold mb-2">Connect Cables (ongoing)</h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Developed a modern site for Connect Cables, ...
            </p>
          </div>
        </ShineBorder> */}
      </div>
    </div>
  );
};

export default ProjectsPage;
