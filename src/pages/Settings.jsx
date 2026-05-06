import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarExtend } = useSelector((state) => state.category);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  // ✅ FIX: redirect properly
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* OVERLAY */}
      <div className={`sm:hidden overlayEffect ${sidebarExtend ? "block" : "hidden"}`} />

      {/* PAGE */}
      <div
        className={`pt-20 px-4 transition-all duration-300 max-w-[1200px] mx-auto
        ${sidebarExtend ? "sm:pl-[220px]" : "sm:pl-[90px]"}`}
      >

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Settings
        </h2>

        {/* ACCOUNT */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Account</h3>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#44a6c6] flex items-center justify-center text-white text-xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <p className="font-medium text-gray-900">
                {user?.email || 'User'}
              </p>
              <p className="text-sm text-gray-500">
                Free Plan
              </p>
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>

          {/* DARK MODE */}
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch themes</p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition
                ${darkMode ? "bg-[#44a6c6]" : "bg-gray-300"}`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full transition
                ${darkMode ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* NOTIFICATIONS */}
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-gray-500">Alerts for activity</p>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition
                ${notifications ? "bg-[#44a6c6]" : "bg-gray-300"}`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full transition
                ${notifications ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* AUTOPLAY */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Autoplay</p>
              <p className="text-sm text-gray-500">Next video auto play</p>
            </div>

            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition
                ${autoplay ? "bg-[#44a6c6]" : "bg-gray-300"}`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full transition
                ${autoplay ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* PRIVACY */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy</h3>

          <div className="space-y-2">

            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              Manage watch history
            </button>

            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              Clear search history
            </button>

            <button className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">
              Delete account
            </button>

          </div>
        </div>

      </div>
    </>
  );
}

export default Settings;