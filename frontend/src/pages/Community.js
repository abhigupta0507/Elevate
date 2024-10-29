import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Community.css";
import userImg from "../images/user.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Your CSS for styling
import like from "../images/like.png";
import unlike from "../images/unlike.svg";
export default function Community({ isAuthenticated }) {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState("top");
  const navigate = useNavigate();
  //console.log(posts);
  const notifyInfo = (message, position) => {
    toast.info(message, {
      position: position,
    });
  };

  const notifyError = (message, position) => {
    toast.error(message, {
      position: position,
    });
  };

  // Fetch all community posts from the API when the component loads
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (!userDetails) {
      notifyInfo("Log in to create your own post", "bottom-right");
    }

    fetch("http://localhost:8000/api/community/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const sortedPosts = posts.sort((a, b) => {
    if (sortType === "top") {
      return b.likes - a.likes;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleLike = async (postId) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (!userDetails) {
      notifyError("Log in to like or dislike this post", "bottom-right");
      return;
    }
    const userId = userDetails.id;

    try {
      const response = await fetch(
        `http://localhost:8000/api/community/posts/${postId}/like/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Pass user_id in the request body
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.likes,
                  is_liked_by_user: data.is_liked_by_user, // Assuming your API returns if the user has liked it
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
    <>
      <ToastContainer />
      <div className="community-page">
        <div className="sort-options">
          <button onClick={() => setSortType("recent")}>Recent Posts</button>
          <button onClick={() => setSortType("top")}>Top Posts</button>
          {isAuthenticated && (
            <button
              style={{ backgroundColor: "#4CAF50" }}
              onClick={() => navigate("/UserPost")}
            >
              Your Posts
            </button>
          )}
        </div>

        <div className="posts-container">
          {sortedPosts.map((post) => (
            <Post key={post.id} post={post} handleLike={handleLike} />
          ))}
        </div>
      </div>
    </>
  );
}

function Post({ post, handleLike }) {
  const username =`${post.first_name} ${post.last_name}`;
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

          <p className="date-post">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}


