import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useTrading } from "../context/TradingContext";
import { Lock, Mail, ShieldCheck, ArrowRight, Zap, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();
  const { user, notify, loginAsDemo } = useTrading();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      notify("Welcome back! Login successful.", "success");
      navigate("/dashboard");
    } catch (error) {
      console.warn("Firebase login failed:", error);
      let msg = "Failed to sign in. Please verify your credentials.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        msg = "Invalid email or password. Please check your credentials or create a new account.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Access temporarily disabled due to too many failed attempts. Please try again later.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    const targetEmail = (resetEmail || email).trim();
    if (!targetEmail) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setSuccessMsg(`Password reset instructions sent to ${targetEmail}. Please check your inbox or spam folder.`);
      notify("Password reset email sent!", "success");
    } catch (error) {
      console.warn("Password reset error:", error);
      let msg = "Could not send password reset email. Please verify the address.";
      if (error.code === "auth/user-not-found") {
        msg = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#F0B90B]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#0ecb81]/10 blur-[130px]" />

      <div className="w-full max-w-md rounded-3xl border border-slate-800/90 bg-[#0c101a] p-8 shadow-2xl relative z-10 space-y-6">
        {/* LOGO */}
        <div className="text-center space-y-2">
          <Link to="/login" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F0B90B] to-[#fcd535] text-black font-black text-2xl shadow-lg shadow-[#F0B90B]/20">
              W
            </div>
            <span className="text-2xl font-black text-white tracking-wider">
              Wise<span className="text-[#F0B90B]">Trade</span>
            </span>
          </Link>
          <div className="pt-2">
            <h2 className="text-xl font-bold text-white">Sign in to WiseTrade</h2>
            <p className="text-xs text-slate-400 mt-1">
              Authentication required to access spot markets & trading terminal
            </p>
          </div>
        </div>

        {/* SECURITY BADGE */}
        <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 py-2 px-3 text-[11px] text-slate-300">
          <ShieldCheck size={14} className="text-[#0ecb81]" />
          <span>Encrypted 256-Bit SSL Institutional Gate</span>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 leading-relaxed">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 leading-relaxed flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {showForgot ? (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-[11px] text-slate-300 leading-relaxed">
              Enter your registered account email. We will send you an official Firebase password reset link to safely choose a new password.
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block" htmlFor="resetEmail">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="resetEmail"
                  type="email"
                  required
                  value={resetEmail || email}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-800 bg-[#121724] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#F0B90B] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#F0B90B] py-3.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-lg shadow-[#F0B90B]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={15} />
              <span>{loading ? "Sending Reset Email..." : "Send Password Reset Link"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 py-1"
            >
              <ArrowLeft size={13} />
              <span>Back to Sign In</span>
            </button>
          </form>
        ) : (
          /* STANDARD LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-800 bg-[#121724] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#F0B90B] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setResetEmail(email);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[11px] text-[#F0B90B] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-[#121724] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#F0B90B] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#F0B90B] py-3.5 text-xs font-black text-black hover:bg-[#fcd535] transition shadow-lg shadow-[#F0B90B]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <span className="bg-[#0c101a] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest absolute">
            or explore
          </span>
        </div>

        {/* 1-CLICK INSTANT DEMO ACCESS */}
        <button
          type="button"
          onClick={() => {
            loginAsDemo();
            navigate("/dashboard");
          }}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-emerald-500/20 py-3 text-xs font-bold text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Zap size={14} className="text-emerald-400" />
          <span>Instant 1-Click Sandbox Demo ($10,000 Portfolio)</span>
        </button>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
          New to WiseTrade?{" "}
          <Link to="/register" className="text-[#F0B90B] font-bold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;