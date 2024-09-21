import React, { useState } from "react";
import "../components/styles/UserPost.css"; // Import CSS for styling
const userpostdata = [
  {
    id: 1,
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
    userImage: "https://randomuser.me/api/portraits/men/1.jpg",
    title: "Best Diet for Weight Loss",
    content:
      "The weight loss plan has been a game changer for me. I feel more energetic and healthy!",
    likes: 90,
    dislikes: 3,
    date: "2024-09-19",
  },
];
const UserPost = () => {
  const [userPosts, setUserPosts] = useState(userpostdata);
  const [newPost, setNewPost] = useState({ title: "", content: "" });


  
  const handleNewPost = () => {
    const post = {
      id: userPosts.length + 1,
      title: newPost.title,
      content: newPost.content,
      date: new Date().toISOString().split("T")[0],
    };
    setUserPosts([post, ...userPosts]);
    setNewPost({ title: "", content: "" }); // Reset the inputs
  };
  const handleLike = (id) => {
    const updatedPosts = userPosts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setUserPosts(updatedPosts);
  };

  const handleDislike = (id) => {
    const updatedPosts = userPosts.map((post) =>
      post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
    );
    setUserPosts(updatedPosts);
  };

  return (
    <div className="user-posts-page">
      {/* Create a New Post */}
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
          Submit
        </button>
      </div>

      {/* User's Posts */}
      <div className="user-posts-section-container">
        <div className="user-posts-section">
          <h1>Your Previous Posts</h1>
          <div className="posts-container">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className="post">
                  <img
                    src={post.userImage}
                    alt={post.username}
                    className="user-image"
                  />
                  <div className="post-content">
                    <div className="post-date-and-title">
                      <h3>{post.title}</h3>
                      <p>{post.date}</p>
                    </div>
                    <p className="post-detail">{post.content}</p>
                    <div className="post-actions">
                      <button onClick={() => handleLike(post.id)}>
                        👍 {post.likes}
                      </button>
                      <button onClick={() => handleDislike(post.id)}>
                        👎 {post.dislikes}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>You have not made any posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
