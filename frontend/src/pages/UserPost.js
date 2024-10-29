import React, { useState, useEffect } from "react";
import "../components/styles/UserPost.css"; // Your CSS for styling
import userImg from "../images/user.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Your CSS for styling
import like from "../images/like.png";
import unlike from "../images/unlike.svg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export default function UserPost() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

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
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
        console.log("exp");
        // Access token expired, try to refresh
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
            //console.log(true);
            setIsAuthenticated(true);
          } else {
            console.log(false);
            // Refresh token expired or invalid, log out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        // Access token is valid
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Fetch user posts from the API when the component loads
  useEffect(() => {
    //const user = JSON.parse(localStorage.getItem("userDetails"));
    // console.log(user);
    //const userId = user.id;
    if (!isAuthenticated) {
      alert("Oops login expired! Login Again");
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Oops login expired! Login Again");
      navigate("/login");
    }
    fetch("http://localhost:8000/api/community/posts/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

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
                <Post key={post.id} post={post} handleLike={handleLike} />
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
            <button className="likebutton" onClick={() => handleLike(post.id)}>
              {post.is_liked_by_user ? (
                <img className="likeimage" src={like} alt="liked"></img>
              ) : (
                <img className="unlikeimage" src={unlike} alt="unliked"></img>
              )}
            </button>
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
