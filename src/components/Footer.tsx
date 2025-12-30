import { Instagram, Twitter, Facebook } from "lucide-react";
import SplitText from "./SplitText";

const Footer = () => {
  // Generate 128 bubbles with random properties
  const bubbles = Array.from({ length: 128 }, (_, i) => ({
    id: i,
    size: `${6 + Math.random() * 12}rem`,
    distance: `${6 + Math.random() * 2}rem`,
    position: `${-5 + Math.random() * 130}%`,
    time: `${2 + Math.random() * 4}s`,
    delay: `${-1 * (2 + Math.random() * 2)}s`,
  }));

  return (
    <>
      <div className="min-h-screen grid grid-rows-[1fr_10rem_auto] overflow-x-hidden bg-[#FFFFFF]">
        <main className="justify-start grid-rows-[main]">{/* Your main content here */}</main>
        
        <div className="grid-rows-[.]"></div>
        
        <footer className="relative z-10">
          {/* Bubbles Container */}
          {/* <div className="absolute top-0 left-0 right-0 h-4 bg-[#D8A1A5] bubble-container">
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="bubble absolute rounded-full bg-[#D8A1A5]"
                style={{
                  '--size': bubble.size,
                  '--distance': bubble.distance,
                  '--position': bubble.position,
                  '--time': bubble.time,
                  '--delay': bubble.delay,
                  left: bubble.position,
                  animation: `bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s), 
                             bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s)`,
                  transform: 'translate(-50%, 100%)',
                } as React.CSSProperties}
              />
            ))}
          </div> */}

          {/* Footer Content */}
          <div className="relative z-20 p-4 md:p-8 bg-[#D8A1A5]">
            {/* Brand Name with SplitText - Left Aligned */}
            <div className="mb-4">
              <SplitText
                text="Hooks on Loops"
                className="text-4xl font-f4 font-semibold text-white text-left"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
              />
            </div>

            {/* Description - Left Aligned */}
            <p className="text-white/90 text-lg max-w-xl mb-8 leading-relaxed text-left">
              Radically handmade crochet for the main character. Made with botanical yarns and lots of love. Each piece is uniquely crafted to add warmth and personality to your space.
            </p>

            {/* Newsletter Subscribe - Left Aligned */}
            <form className="mb-8 max-w-md">
              <label className="block text-white font-semibold mb-3 text-sm uppercase tracking-wide text-left">
                Subscribe to Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-[#D8A1A5] font-bold rounded-lg hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Social Links - Left Aligned */}
            <div className="flex gap-4 mb-8 justify-start">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#D8A1A5] transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#D8A1A5] transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#D8A1A5] transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright - Left Aligned */}
            <p className="text-white/70 text-sm  md:text-right">
              © 2025 Hooks & Loops. All rights reserved. Made with{' '}
              <span className="text-white">❤️</span> for your home.
            </p>
          </div>
        </footer>

        {/* SVG Filter Definition */}
        <svg className="fixed top-[100vh]">
          <defs>
            <filter id="blob">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="blob"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Bubble Animation Styles */}
      <style>{`
        @keyframes bubble-size {
          0%, 75% {
            width: var(--size, 4rem);
            height: var(--size, 4rem);
          }
          100% {
            width: 0rem;
            height: 0rem;
          }
        }

        @keyframes bubble-move {
          0% {
            bottom: -4rem;
          }
          100% {
            bottom: var(--distance, 10rem);
          }
        }

        .bubble-container {
          filter: url(#blob);
        }
      `}</style>
    </>
  );
};

export default Footer;
