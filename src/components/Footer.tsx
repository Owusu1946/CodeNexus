import { Blocks } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 mt-auto">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Footer Left */}
          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
            <Blocks className="w-5 h-5" />
            <span>Built for developers, by developers</span>
          </div>
          {/* Footer Links */}
          <div className="flex flex-wrap items-center gap-4 justify-center text-sm">
            <Link
              href="/web-editor"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              CodeNexus Web Editor
            </Link>
            <Link
              href="/"

              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/support"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>
          </div>
          {/* Footer Right */}
          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
            <Blocks className="w-5 h-5" />
            <p>
              Developed by{" "}
              <Link
                href="https://kennethowusu.vercel.app"
                target="_blank"
                className="text-blue-500 hover:underline"
              >

                Owusu Kenneth
              </Link>
            </p>
          </div>

        </div>
        {/* Copyright Section */}
        <div className="text-center text-gray-400 text-xs md:text-sm mt-6">
          &copy; {new Date().getFullYear()} CodeNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
