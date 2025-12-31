import { Instagram, Twitter, Facebook } from "lucide-react";
import SplitText from "./SplitText";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#D8A1A5] to-[#E8B4B8] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-12">
          {/* Left Column */}
          <div>
            {/* Brand Name - Simple version without SplitText */}
            <div className="mb-6">
              <h2 className="text-5xl font-black font-f4 text-white leading-tight">
                Hooks & Loops
              </h2>
            </div>

            {/* Description */}
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              Radically handmade crochet for the main character. Made with botanical yarns and lots of love. Each piece is uniquely crafted to add warmth and personality to your space.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#D8A1A5] transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#D8A1A5] transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#D8A1A5] transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-3">Stay Connected</h3>
            <p className="text-white/80 mb-6">
              Subscribe to get updates on new arrivals and exclusive offers
            </p>
            
            <form className="max-w-md">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all font-medium"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-[#D8A1A5] font-bold rounded-2xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between md:items-end items-center gap-4">
            <p className="text-white/70 text-sm">
              © 2025 <span className="text-white text-md font-f1 font-bold">Hooks & Loops.</span> All rights reserved.
            </p>
            <p className="text-white/70 text-sm">
              Made with <span className="text-white text-xl font-f1 font-bold">love</span> for your home
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
