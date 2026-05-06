import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* HEADER (YouTube style) */}
        <div className="flex flex-col items-center mb-8">

          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#eaf6fb]">
            <FaYoutube size={34} style={{ color: "#8adaf5" }} />
          </div>

          <h2 className="text-2xl font-semibold mt-4 text-gray-900">
            Sign in
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            to continue to <span className="font-medium text-gray-700">MyTube</span>
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full mt-1 px-4 py-2
                border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#44a6c6]
              "
              placeholder="Enter your email"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="text-sm text-gray-600">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full mt-1 px-4 py-2 pr-10
                border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#44a6c6]
              "
              placeholder="Enter your password"
            />

            {/* EYE ICON */}
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <MdVisibility size={20} />
                ) : (
                  <MdVisibilityOff size={20} />
                )}
              </button>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-2.5
              text-white font-medium
              rounded-lg
              transition
              disabled:opacity-50
              hover:opacity-90
            "
            style={{ backgroundColor: "#44a6c6" }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium hover:underline"
            style={{ color: "#44a6c6" }}
          >
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;