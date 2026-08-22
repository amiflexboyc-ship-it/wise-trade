import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-cyan-400 tracking-wide"
        >
          WiseTrade
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#home" className="hover:text-cyan-400 duration-300">
            Home
          </a>

          <a href="#markets" className="hover:text-cyan-400 duration-300">
            Markets
          </a>

          <a href="#features" className="hover:text-cyan-400 duration-300">
            Features
          </a>

          <a href="#about" className="hover:text-cyan-400 duration-300">
            About
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="border border-cyan-400 px-5 py-2 rounded-lg text-white hover:bg-cyan-400 hover:text-black duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-cyan-400 px-5 py-2 rounded-lg font-semibold text-black hover:bg-cyan-300 duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;