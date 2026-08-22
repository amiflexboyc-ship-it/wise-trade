
const stats = [
  {
    number: "250K+",
    label: "Active Traders",
  },
  {
    number: "$5B+",
    label: "Trading Volume",
  },
  {
    number: "120+",
    label: "Countries",
  },
  {
    number: "99.9%",
    label: "Platform Uptime",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="bg-slate-950 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>
          <span className="text-cyan-400 font-semibold uppercase tracking-widest">
            About WiseTrade
          </span>

          <h2 className="text-5xl font-bold mt-4 leading-tight">
            The Future of
            <span className="text-cyan-400"> Crypto Trading</span>
          </h2>

          <p className="mt-6 text-gray-400 leading-8">
            WiseTrade is built to help beginners and professional traders
            invest with confidence. We combine security, speed, and
            advanced trading tools into one modern platform.
          </p>

          <p className="mt-6 text-gray-400 leading-8">
            Whether you're buying your first cryptocurrency or managing
            a professional portfolio, WiseTrade provides a simple,
            secure and reliable experience.
          </p>

          <button className="mt-10 bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-cyan-300 duration-300">
            Learn More
          </button>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-2 gap-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-cyan-400 duration-300"
            >
              <h2 className="text-4xl font-bold text-cyan-400">
                {item.number}
              </h2>

              <p className="text-gray-400 mt-3">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default About;