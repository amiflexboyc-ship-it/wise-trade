import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Loging() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleLoging = async (e) => {
    e.preventDefault();

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful!");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);
      alert(error.message);

    }
  };


  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">


      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">


        {/* Logo */}
        <h1 className="text-3xl font-bold text-white text-center">
          wiseTrade
        </h1>


        <p className="text-gray-400 text-center mt-2 mb-8">
          Login to your trading account
        </p>



        <form 
          onSubmit={handleLoging}
          className="space-y-5"
        >


          {/* Email */}
          <div>

            <label className="text-gray-300">
              Email
            </label>

            <input

              type="email"

              placeholder="Enter your email"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

              required

              className="
              w-full mt-2 px-4 py-3
              bg-slate-800
              text-white
              rounded-lg
              outline-none
              border border-slate-700
              focus:border-blue-500
              "

            />

          </div>




          <div>

            <label className="text-gray-300">
              Password
            </label>


            <input

              type="password"

              placeholder="Enter your password"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

              required


              className="
              w-full mt-2 px-4 py-3
              bg-slate-800
              text-white
              rounded-lg
              outline-none
              border border-slate-700
              focus:border-blue-500
              "

            />

          </div>




          <button

            type="submit"

            className="
            w-full
            bg-yellow-900
            hover:bg-brown-900
            text-white
            font-semibold
            py-3
            rounded-lg
            transition
            "

          >

            Login

          </button>


        </form>



        <p className="text-gray-400 text-center mt-6">

          Don't have an account?

          <span
            onClick={()=>navigate("/register")}
            className="text-blue-400 ml-2 cursor-pointer hover:underline"
          >
            Register
          </span>

        </p>



      </div>


    </div>

  );

}

export default Loging;


