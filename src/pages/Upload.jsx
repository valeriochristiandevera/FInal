import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { FaTrash } from "react-icons/fa";
import timeSince from '../utils/date';

function Upload() {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const { sidebarExtend } = useSelector((state) => state.category);

  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (token) {
      axios.get('http://localhost:5000/api/upload', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setMyUploads(res.data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/upload',
        { videoUrl, title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccess('Video uploaded successfully!');
        setMyUploads([res.data.upload, ...myUploads]);
        setVideoUrl('');
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uploadId) => {
    if (!window.confirm('Delete this video?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/upload/${uploadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMyUploads(myUploads.filter(u => u.id !== uploadId));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div className={`sm:hidden overlayEffect ${sidebarExtend ? "block" : "hidden"}`} />

      {/* PAGE WRAPPER */}
      <div className={`pt-20 px-4 transition-all duration-300
        ${sidebarExtend ? "sm:pl-[220px]" : "sm:pl-[90px]"}
        max-w-[1600px] mx-auto
      `}>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Upload
          </h1>
          <p className="text-sm text-gray-500">
            Share your video with the world
          </p>
        </div>

        {/* UPLOAD FORM */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">

          <h2 className="text-lg font-semibold mb-4">Upload Video</h2>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded mb-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube URL"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium"
style={{ backgroundColor: "#44a6c6" }}>
              {loading ? "Uploading..." : "Upload"}
            </button>

          </form>
        </div>

        {/* UPLOADS GRID */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            My Uploads
          </h2>

          {myUploads.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No videos uploaded yet
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

              {myUploads.map((upload, index) => (
                <div
                  key={index}
                  className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >

                  <VideoCard
                    title={upload.title}
                    thumbnail={`https://img.youtube.com/vi/${upload.videoId}/mqdefault.jpg`}
                    on={timeSince(new Date(upload.createdAt))}
                    channel={user?.email?.split('@')[0] || 'You'}
                    channelId={upload.userId}
                    videoId={upload.videoId}
                  />

                  {/* DELETE BUTTON (HOVER LIKE YOUTUBE) */}
                  <button
                    onClick={() => handleDelete(upload.id)}
                    className="
                      absolute top-2 right-2
                      bg-black/70 hover:bg-red-600
                      text-white p-2 rounded-full
                      opacity-0 group-hover:opacity-100
                      transition
                    "
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>

                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default Upload;