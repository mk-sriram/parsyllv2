"use client";
import Typewriter from "typewriter-effect";

const HomeSection = () => {
  return (
    <section className="flex flex-col items-center justify-start h-[15rem] bg-white text-center px-4 md:px-0 pt-[50px] mb-[40px]">
      <div className="max-w-3xl">
        <div className="flex flex-col items-center mb-4 space-y-[15px]">
          <div className="text-6xl font-bold custom-gradient h-[60px] ">
            <Typewriter
              options={{
                strings: ["Class Schedules", "Appointments", "Event Details"],
                autoStart: true,
                loop: true,
                deleteSpeed: 35,
                delay: 100,
              }}
            />
          </div>
          <span className="text-5xl font-bold  text-gray-800">
            to Google Calendar
          </span>
          <span className="text-3xl font-medium  text-gray-600 pt-[10px]">
            ✨ in Seconds ✨
          </span>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
