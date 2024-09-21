import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Community.css";

const initialPosts = [
  {
    id: 1,
    username: "John Doe",
    userImage: "https://randomuser.me/api/portraits/men/1.jpg",
    title: "My Fitness Journey",
    content:
      "I’ve been following the advanced workout plan and diet for 3 months, and the results are incredible!",
    likes: 120,
    dislikes: 5,
    date: "2024-09-18",
  },
  {
    id: 2,
    username: "Jane Smith",
    userImage: "https://randomuser.me/api/portraits/women/2.jpg",
    title: "Best Diet for Weight Loss",
    content:
      "The weight loss plan has been a game changer for me. I feel more energetic and healthy!",
    likes: 90,
    dislikes: 3,
    date: "2024-09-19",
  },
  {
    id: 3,
    username: "Mike Johnson",
    userImage: "https://randomuser.me/api/portraits/men/3.jpg",
    title: "Strength Training Success",
    content:
      "Incorporating strength training into my routine has significantly improved my performance!",
    likes: 75,
    dislikes: 2,
    date: "2024-09-20",
  },
  {
    id: 4,
    username: "Emily Davis",
    userImage: "https://randomuser.me/api/portraits/women/4.jpg",
    title: "Vegan Diet Results",
    content:
      "Switching to a vegan diet has helped me lose weight and feel more energetic than ever!",
    likes: 85,
    dislikes: 4,
    date: "2024-09-21",
  },
];

export default function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [sortType, setSortType] = useState("recent");
  const navigate = useNavigate();

  const sortedPosts = posts.sort((a, b) => {
    if (sortType === "top") {
      return b.likes - a.likes;
    }
    return new Date(b.date) - new Date(a.date);
  });

  const handleLike = (id) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
  };

  const handleDislike = (id) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="community-page">
      <div className="sort-options">
      {/*Buttons to sort,latest,your posts*/}
        <button onClick={() => setSortType("recent")}>Recent Posts</button>
        <button onClick={() => setSortType("top")}>Top Posts</button>
        <button
          style={{ backgroundColor: "#4CAF50" }}
          onClick={() => navigate("/UserPost")}
        >
          Your Posts
        </button>
      </div>

      {/*Posts section where we will show all posts */}
      <div className="posts-container">
        {sortedPosts.map((post) => (
          <Post key={post.id} post={post} handleDislike={handleDislike} handleLike={handleLike} />
        ))}
      </div>
    </div>
  );
}

function Post({ post, handleDislike, handleLike }) {
  return (
    <div key={post.id} className="post">
      <img src={post.userImage} alt={post.username} className="user-image" />
      <div className="post-content">
        <div className="post-date-and-title">
          <h3>{post.title}</h3>
          <p>{post.date}</p>
        </div>
        <p className="post-username">by {post.username}</p>
        <p className="post-detail">{post.content}</p>
        <div className="post-actions">
          <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
          <button onClick={() => handleDislike(post.id)}>
            👎 {post.dislikes}
          </button>
        </div>
      </div>
    </div>
  );
}
