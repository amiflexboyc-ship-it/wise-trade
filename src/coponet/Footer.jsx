import {
  Mail,
  MessageCircle,
  Globe,
  Phone,
  Send,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold text-cyan-400">
              WiseTrade
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              A secure and modern cryptocurrency trading platform
              built for beginners and professional traders.
            </p>

            <div className="flex gap-4 mt-6">
              <Mail className="hover:text-cyan-400 cursor-pointer duration-300" />
              <MessageCircle className="hover:text-cyan-400 cursor-pointer duration-300" />
              <Globe className="hover:text-cyan-400 cursor-pointer duration-300" />
              <Phone className="hover:text-cyan-400 cursor-pointer duration-300" />
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Company
            </h3>

            <ul className="space-y-3">
              <li><a href="#about" className="hover:text-cyan-400">About</a></li>
              <li><a href="#features" className="hover:text-cyan-400">Features</a></li>
              <li><a href="#markets" className="hover:text-cyan-400">Markets</a></li>
              <li><a href="#" className="hover:text-cyan-400">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Support
            </h3>

            <ul className="space-y-3">
              <li>Email: support@wisetrade.com</li>
              <li>Phone: +234 800 123 4567</li>
              <li>Help Center</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">
              Newsletter
            </h3>

            <p className="text-gray-400 mb-4">
              Subscribe to receive market news and updates.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-l-lg px-3 py-2 outline-none"
              />

              <button className="bg-cyan-400 px-5 rounded-r-lg text-black hover:bg-cyan-300 duration-300">
                <Send size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-500">
            © 2026 WiseTrade. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400">
              Terms
            </a>

            <a href="#" className="hover:text-cyan-400">
              Privacy
            </a>

            <a href="#" className="hover:text-cyan-400">
              Cookies
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;