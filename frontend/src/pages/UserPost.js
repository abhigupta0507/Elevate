import React, { useState, useEffect } from "react";
import "../components/styles/UserPost.css"; // Your CSS for styling
import userImg from "../images/user.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import like from "../images/like.png";
import unlike from "../images/unlike.svg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";
function Modal({ onClose }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <div className="modal-icon">
          <FaCheckCircle
            className="modal-icon-photo"
            size={50}
            color="#4CAF50"
          />
        </div>
        <h2 className="modal-title">Congratulations!</h2>
        <p className="modal-message">
          Your post has been created successfully.
        </p>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </motion.div>
    </div>
  );
}

export default function UserPost() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();

  const notifySuccess = (message, position) => {
    toast.success(message, {
      position: position,
    });
  };

  const notifyWarning = (message, position) => {
    toast.warn(message, {
      position: position,
    });
  };

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
        if (refreshToken) {
          const response = await fetch(
            "http://localhost:8000/api/users/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Oops login expired! Login Again");
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("accessToken");
    fetch("http://localhost:8000/api/community/posts/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [isAuthenticated, navigate]);

  async function handleNewPost() {
    await checkAuthentication();
    if (!isAuthenticated) {
      alert("Oops login expired! Login Again");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const postData = {
      title: newPost.title,
      content: newPost.content,
    };

    if (!newPost.title || !newPost.content) {
      notifyWarning("Post cant be empty");
      return;
    }

    fetch("http://localhost:8000/api/community/posts/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserPosts([data, ...userPosts]);
        setNewPost({ title: "", content: "" });
        setIsModalOpen(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Stop confetti after 3 seconds
      })
      .catch((error) => console.error("Error creating post:", error));
  }

  const handleLike = async (postId) => {
    try {
      await checkAuthentication();
      if (!isAuthenticated) {
        notifyWarning("Login expired!", "bottom-right");
        return;
      }
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8000/api/community/posts/${postId}/like/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.likes,
                  is_liked_by_user: data.is_liked_by_user,
                }
              : post
          )
        );
      } else {
        console.error("Error liking post:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="user-posts-page">
      <ToastContainer />
      {showConfetti && <Confetti />}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}

      <div className="create-post-section">
        <h1>Create a Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="post-title-input"
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="post-content-textarea"
        />
        <button onClick={handleNewPost} className="submit-post-button">
          Post
        </button>
      </div>

      <div className="user-posts-section-container">
        <div className="user-posts-section">
          <h1>Your Previous Posts</h1>
          <div className="posts-container">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <AnimatedPost
                  key={post.id}
                  post={post}
                  handleLike={handleLike}
                />
              ))
            ) : (
              <p>You have not made any posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Post({ post, handleLike }) {
  const username = `${post.first_name} ${post.last_name}`;
  return (
    <div className="post">
      <div className="imageusername">
        <img
          src={post.userImage || userImg}
          alt={username}
          className="user-image"
        />
        <p className="post-username">{username}</p>
      </div>

      <div className="post-content">
        <div className="post-date-and-content">
          <h3>{post.title}</h3>
          <p className="post-detail" style={{ whiteSpace: "initial" }}>
            {post.content}
          </p>
        </div>

        <div className="post-actions">
          <div>
            <motion.button
              className="likebutton"
              onClick={() => handleLike(post.id)}
              whileTap={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.img
                className={post.is_liked_by_user ? "likeimage" : "unlikeimage"}
                src={post.is_liked_by_user ? like : unlike}
                alt={post.is_liked_by_user ? "liked" : "unliked"}
              />
            </motion.button>
            <p>{post.likes}</p>
          </div>
          <p className="date-post">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

const AnimatedPost = ({ post, handleLike }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Post post={post} handleLike={handleLike} />
    </motion.div>
  );
};
