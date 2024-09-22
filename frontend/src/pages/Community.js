import React, { useState } from "react";
import "../components/styles/Community.css"; // Import the CSS for styling

// Sample post data
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
  {
    id: 5,
    username: "Chris Brown",
    userImage: "https://randomuser.me/api/portraits/men/5.jpg",
    title: "Running My First Marathon",
    content:
      "I completed my first marathon last weekend! The training was tough, but worth it!",
    likes: 110,
    dislikes: 1,
    date: "2024-09-22",
  },
  {
    id: 6,
    username: "Sarah Wilson",
    userImage: "https://randomuser.me/api/portraits/women/5.jpg",
    title: "Yoga for Mindfulness",
    content:
      "Practicing yoga has helped me find balance and mindfulness in my daily life.",
    likes: 60,
    dislikes: 2,
    date: "2024-09-23",
  },
  {
    id: 7,
    username: "David Lee",
    userImage: "https://randomuser.me/api/portraits/men/6.jpg",
    title: "Healthy Meal Prep Tips",
    content:
      "Meal prepping has made it easier for me to stick to my diet and save time during the week!",
    likes: 95,
    dislikes: 0,
    date: "2024-09-24",
  },
  {
    id: 8,
    username: "Laura Martinez",
    userImage: "https://randomuser.me/api/portraits/women/6.jpg",
    title: "HIIT Workouts for Fat Loss",
    content:
      "High-Intensity Interval Training has helped me shed fat quickly and efficiently!",
    likes: 120,
    dislikes: 3,
    date: "2024-09-25",
  },
  {
    id: 9,
    username: "Brian White",
    userImage: "https://randomuser.me/api/portraits/men/7.jpg",
    title: "Finding the Right Supplements",
    content:
      "Finding the right supplements has really boosted my recovery and performance!",
    likes: 70,
    dislikes: 1,
    date: "2024-09-26",
  },
  {
    id: 10,
    username: "Sophia Garcia",
    userImage: "https://randomuser.me/api/portraits/women/7.jpg",
    title: "Dancing for Fitness",
    content:
      "I never knew dancing could be such a fun way to stay fit! I love it!",
    likes: 80,
    dislikes: 2,
    date: "2024-09-27",
  },
];

const Community = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({
    username: "",
    title: "",
    content: "",
    userImage: "",
  });
  const [sortType, setSortType] = useState("recent");

  // Function to handle sorting
  const sortedPosts = posts.sort((a, b) => {
    if (sortType === "top") {
      return b.likes - a.likes;
    }
    return new Date(b.date) - new Date(a.date);
  });

  // Function to handle like/dislike
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

  // Function to handle new post submission
  const handleNewPost = () => {
    const post = {
      ...newPost,
      id: posts.length + 1,
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setPosts([post, ...posts]);
    setNewPost({ username: "", title: "", content: "", userImage: "" });
  };

  return (
    <div className="community-page">
      {/* Sorting Options */}
      <div className="sort-options">
        <button onClick={() => setSortType("recent")}>Recent Posts</button>
        <button onClick={() => setSortType("top")}>Top Posts</button>
      </div>

      {/* Post Section */}
      <div className="posts-container">
        {sortedPosts.map((post) => (
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
              <p className="post-username">by {post.username}</p>
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
        ))}
      </div>

      {/* New Post Section */}
      <div className="new-post-section">
        <h2>Create a Post</h2>

        <input
          type="text"
          placeholder="Post Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Your Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />

        <button onClick={handleNewPost}>Submit</button>
      </div>
    </div>
  );
};

export default Community;

// import React, { useState } from 'react';
// import '../components/styles/Community.css'; // Import your CSS for styling

// // Sample data for posts
// const postsData = [
//   {
//     id: 1,
//     userName: 'John Doe',
//     title: 'Morning Routine for Weight Loss',
//     content: 'I have started a morning routine with 30 minutes of jogging and it’s working wonders!',
//     date: 'Sept 15, 2024',
//     likes: 12,
//     dislikes: 3,
//     userImage: 'https://via.placeholder.com/50',
//   },
//   {
//     id: 2,
//     userName: 'Jane Smith',
//     title: 'Tips for Vegan Diet',
//     content: 'Here are some tips to make a balanced vegan diet. I’ve been following it for 3 months!',
//     date: 'Sept 17, 2024',
//     likes: 25,
//     dislikes: 1,
//     userImage: 'https://via.placeholder.com/50',
//   },
//   // Add more sample posts if needed
// ];

// const Community = () => {
//   const [posts, setPosts] = useState(postsData);
//   const [newPost, setNewPost] = useState({ title: '', content: '' });

//   // Function to handle post submission
//   const handlePostSubmit = () => {
//     const updatedPosts = [
//       ...posts,
//       {
//         id: posts.length + 1,
//         userName: 'Current User', // Replace this with logged-in user's name
//         title: newPost.title,
//         content: newPost.content,
//         date: new Date().toLocaleDateString(),
//         likes: 0,
//         dislikes: 0,
//         userImage: 'https://via.placeholder.com/50', // Replace with user's image
//       },
//     ];
//     setPosts(updatedPosts);
//     setNewPost({ title: '', content: '' });
//   };

//   return (
//     <div className="community-page">
//       <div className="posts-section">
//         <h1>Community Posts</h1>
//         {posts.map((post) => (
//           <div key={post.id} className="post">
//             <div className="post-header">
//               <img src={post.userImage} alt="User" className="user-image" />
//               <div className="post-info">
//                 <h3 className="post-user">{post.userName}</h3>
//                 <p className="post-date">{post.date}</p>
//               </div>
//             </div>
//             <h2 className="post-title">{post.title}</h2>
//             <p className="post-content">{post.content}</p>
//             <div className="post-actions">
//               <button className="like-button">👍 {post.likes}</button>
//               <button className="dislike-button">👎 {post.dislikes}</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="create-post-section">
//         <h2>Create Your Post</h2>
//         <input
//           type="text"
//           placeholder="Title"
//           value={newPost.title}
//           onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
//         />
//         <textarea
//           placeholder="What's on your mind?"
//           value={newPost.content}
//           onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
//         />
//         <button onClick={handlePostSubmit} className="submit-button">Post</button>
//       </div>

//       <div className="user-posts-section">
//         <h2>Your Posts</h2>
//         {/* You can map over the user's own posts here */}
//         {posts
//           .filter((post) => post.userName === 'Current User') // Filter by logged-in user
//           .map((post) => (
//             <div key={post.id} className="post">
//               <h2 className="post-title">{post.title}</h2>
//               <p className="post-content">{post.content}</p>
//               <p className="post-date">{post.date}</p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Community;

// import React, { useState, useRef } from "react";
// import "../components/styles/Community.css"; // Import the CSS for styling

// // Sample post data
// const initialPosts = [
//   {
//     id: 1,
//     username: "John Doe",
//     userImage: "https://randomuser.me/api/portraits/men/1.jpg",
//     title: "My Fitness Journey",
//     content:
//       "I’ve been following the advanced workout plan and diet for 3 months, and the results are incredible!",
//     likes: 120,
//     dislikes: 5,
//     date: "2024-09-18",
//   },
//   {
//     id: 2,
//     username: "John Doe",
//     userImage: "https://randomuser.me/api/portraits/women/6.jpg",
//     title: "My Fitness Journey",
//     content:
//       "I’ve been following the advanced workout plan and diet for 3 months, and the results are incredible!",
//     likes: 120,
//     dislikes: 5,
//     date: "2024-09-18",
//   },
//   {
//     id: 3,
//     username: "John Doe",
//     userImage: "https://randomuser.me/api/portraits/men/2.jpg",
//     title: "My Fitness Journey",
//     content:
//       "I’ve been following the advanced workout plan and diet for 3 months, and the results are incredible!",
//     likes: 120,
//     dislikes: 5,
//     date: "2024-09-18",
//   },
//   {
//     id: 4,
//     username: "John Doe",
//     userImage: "https://randomuser.me/api/portraits/men/3.jpg",
//     title: "My Fitness Journey",
//     content:
//       "I’ve been following the advanced workout plan and diet for 3 months, and the results are incredible!",
//     likes: 120,
//     dislikes: 5,
//     date: "2024-09-18",
//   },
//   {
//     id: 5,
//     username: "Jane Smith",
//     userImage: "https://randomuser.me/api/portraits/women/5.jpg",
//     title: "Best Diet for Weight Loss",
//     content:
//       "The weight loss plan has been a game changer for me. I feel more energetic and healthy!",
//     likes: 90,
//     dislikes: 3,
//     date: "2024-09-19",
//   },
//   // More posts...
// ];

// const Community = () => {
//   const [posts, setPosts] = useState(initialPosts);
//   const [newPost, setNewPost] = useState({
//     username: "",
//     title: "",
//     content: "",
//     userImage: "",
//   });
//   const [sortType, setSortType] = useState("recent");
//   const myPostsRef = useRef(null);

//   // Function to handle sorting
//   const sortedPosts = posts.sort((a, b) => {
//     if (sortType === "top") {
//       return b.likes - a.likes;
//     }
//     return new Date(b.date) - new Date(a.date);
//   });

//   // Function to handle like/dislike
//   const handleLike = (id) => {
//     const updatedPosts = posts.map((post) =>
//       post.id === id ? { ...post, likes: post.likes + 1 } : post
//     );
//     setPosts(updatedPosts);
//   };

//   const handleDislike = (id) => {
//     const updatedPosts = posts.map((post) =>
//       post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
//     );
//     setPosts(updatedPosts);
//   };

//   // Function to handle new post submission
//   const handleNewPost = () => {
//     const post = {
//       ...newPost,
//       id: posts.length + 1,
//       likes: 0,
//       dislikes: 0,
//       date: new Date().toISOString().split("T")[0],
//     };
//     setPosts([post, ...posts]);
//     setNewPost({ username: "", title: "", content: "", userImage: "" });
//   };

//   // Scroll to "My Posts" section
//   const scrollToMyPosts = () => {
//     myPostsRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="community-page">
//       <h1>Community</h1>

//       {/* Sorting Options */}
//       <div className="sort-options">
//         <button onClick={() => setSortType("recent")}>Recent Posts</button>
//         <button onClick={() => setSortType("top")}>Top Posts</button>
//         <button onClick={scrollToMyPosts}>Go to My Posts</button>
//       </div>

//       <div className="main-content">
//         {/* Post Section */}
//         <div className="posts-container">
//           {sortedPosts.map((post) => (
//             <div key={post.id} className="post">
//               <img
//                 src={post.userImage}
//                 alt={post.username}
//                 className="user-image"
//               />
//               <div className="post-content">
//                 <h3 className="post-title">{post.title}</h3>
//                 <p className="post-username">by {post.username}</p>
//                 <p className="post-date">{post.date}</p>
//                 <p className="post-text">{post.content}</p>
//                 <div className="post-actions">
//                   <button onClick={() => handleLike(post.id)}>
//                     👍 {post.likes}
//                   </button>
//                   <button onClick={() => handleDislike(post.id)}>
//                     👎 {post.dislikes}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* New Post Section */}
//         {/* <div className="new-post-section">
//           <h2>Create a Post</h2>
//           <input
//             type="text"
//             placeholder="Your Name"
//             value={newPost.username}
//             onChange={(e) => setNewPost({ ...newPost, username: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Post Title"
//             value={newPost.title}
//             onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
//           />
//           <textarea
//             placeholder="Your Content"
//             value={newPost.content}
//             onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="User Image URL"
//             value={newPost.userImage}
//             onChange={(e) => setNewPost({ ...newPost, userImage: e.target.value })}
//           />
//           <button onClick={handleNewPost}>Submit</button>
//         </div>
//       </div> */}
//         <div className="create-post-section">
//           <h2>Create Your Post</h2>
//           <input
//             type="text"
//             placeholder="Title"
//             value={newPost.title}
//             onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
//           />
//           <textarea
//             placeholder="What's on your mind?"
//             value={newPost.content}
//             onChange={(e) =>
//               setNewPost({ ...newPost, content: e.target.value })
//             }
//           />
//           <button onClick={handleNewPost} className="submit-button">
//             Post
//           </button>
//         </div>

//         {/* My Posts Section */}

//       </div>
//       <div className="my-posts-section" ref={myPostsRef}>
//           <h2>My Posts</h2>
//           {posts
//             .filter((post) => post.username === newPost.username)
//             .map((post) => (
//               <div key={post.id} className="post">
//                 <h3 className="post-title">{post.title}</h3>
//                 <p className="post-username">by {post.username}</p>
//                 <p className="post-date">{post.date}</p>
//                 <p className="post-text">{post.content}</p>
//               </div>
//             ))}
//         </div>
//     </div>
//   );
// };
