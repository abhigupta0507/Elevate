import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Home.css";
import "../components/styles/Reviewslider.css";
import dietHome from "../images/diet_Home.jpg";
import professionalHome from "../images/home.png";
import progressImg from "../images/progress_Home.png";
import BadgeImg from "../images/badge_Home.png";
import { motion } from "framer-motion";
import CommunityImg from "../images/Community_Home.png";
import WorkoutImg from "../images/workoutplans_Home.png";
const reviews = [
  {
    name: "John Doe",
    review:
      "This website has helped me a lot to stay on track with my fitness goals. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Jane Smith",
    review:
      "Great platform! The workout plans and diet suggestions are spot on. I feel more energetic every day.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Michael Johnson",
    review:
      "The community is amazing, and the coaches are very supportive. Love the user experience here!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Emily Davis",
    review:
      "The app design is sleek, and the features are incredibly user-friendly. My fitness journey has improved a lot.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Chris Lee",
    review:
      "I’ve made significant progress thanks to the detailed workout and diet plans.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Sophia Brown",
    review: "Love the UI/UX design of the website. It’s really easy to use!",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
export default function Home({ isAuthenticated }) {
  const navigate = useNavigate();
  const access = localStorage.getItem("accessToken");

  return (
    <div>
      <MainPage isAuthenticated={isAuthenticated} navigate={navigate} />
      <Heading text="Achieve Your Fitness Goals" />
      <DescribeBlockCard
        title="WORKOUT PLANS"
        content="Transform your fitness with structured workout plans designed for every level. From beginner to advanced routines, follow exercises tailored to your body and track calories burned as you progress toward your goals"
        photo={WorkoutImg}
        buttontext="LEARN MORE"
        path="/workoutplans"
      />
      <div className="Progress-Home-home">
        <Heading text="Monitor Your Progress" />
        <CardOfTwo
          title1="PROGRESS"
          content1="Track your progress using our graph which displays
          calories burned in last 7 days"
          photo1={progressImg}
          path1="/progress"
          buttontext="LEARN MORE"
          title2="BADGES"
          content2="Reward yourself with badges given by us to motivate you for completing
          tasks"
          photo2={BadgeImg}
          path2="/progress"
        />
      </div>
      <Heading text="Your Guide to Healthy Eating" />
      <DescribeBlockCard
        title="DIET PLANS"
        content="Discover personalized diet plans tailored to your goals—whether you're aiming for weight loss, muscle gain, or maintaining a balanced lifestyle. Choose from vegan, vegetarian, or non-vegan options to fuel your journey and track your daily progress"
        photo={dietHome}
        buttontext="LEARN MORE"
        path="/dietplans"
      />
      <Heading text="Reviews of our Users" />
      <ReviewSlider />

      <div className="Progress-Home-home">
        <Heading text="Be a part of Elevate Community" />
        <DescribeBlockCard
          title="Community"
          content="Discover a vibrant space where you can connect with others, share your fitness journey, and learn from one another. From inspiring stories to helpful tips, our community is here to support you every step of the way."
          photo={CommunityImg}
          buttontext="EXPLORE"
          path="/community"
        />
      </div>
    </div>
  );
}

function Heading({ text }) {
  return (
    <motion.h1
      className="heading-text-home"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={headingVariants}
    >
      {text}
    </motion.h1>
  );
}
// function DescribeBlockCard({ title, content, photo, buttontext, path }) {
//   const navigate = useNavigate();

//   return (
//     <div className="class-studio-container-home">
//       <div className="class-studio-text-home">
//         <h1>{title}</h1>
//         <p>{content}</p>
//         <button className="class-button-home" onClick={() => navigate(path)}>
//           {buttontext}
//         </button>
//       </div>
//       <div className="class-studio-video-home">
//         <img
//           src={photo}
//           alt="Workout Class"
//           className="class-video-placeholder-home"
//           loading="lazy"
//         />
//       </div>
//     </div>
//   );
// }

function DescribeBlockCard({ title, content, photo, buttontext, path }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="class-studio-container-home"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="class-studio-text-home">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {content}
        </motion.p>
        <motion.button
          className="class-button-home"
          onClick={() => navigate(path)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttontext}
        </motion.button>
      </div>
      <div className="class-studio-video-home">
        <img
          src={photo}
          alt="Workout Class"
          className="class-video-placeholder-home"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}

// const MainPage = ({ isAuthenticated, navigate }) => {
//   function handleTakemeaway() {
//     if (!isAuthenticated) navigate("/login");
//     else navigate("/dashboard");
//   }
//   return (
//     <div className="main-container-home">
//       <div className="left-section-home">
//         <p className="left-section-name-home">ELEVATE</p>
//         <p className="left-section-detail-home">
//           IT'S TIME TO BE HEALTHY AND IN GREAT SHAPE
//         </p>
//         <button className="signup-button-home" onClick={handleTakemeaway}>
//           {isAuthenticated ? "WELCOME BACK" : "SIGN UP NOW"}
//         </button>
//       </div>
//       <div className="right-section-home">
//         <img
//           src={professionalHome}
//           alt="fitness"
//           className="fitness-image-home"
//           loading="lazy"
//         />
//         <div className="circle-text">
//           <p>Elevate your physical fitness by our workout and diet plans</p>
//         </div>
//       </div>
//     </div>
//   );
// };
const MainPage = ({ isAuthenticated, navigate }) => {
  function handleTakemeaway() {
    if (!isAuthenticated) navigate("/login");
    else navigate("/dashboard");
  }

  return (
    <motion.div
      className="main-container-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="left-section-home"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.p
          className="left-section-name-home"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          ELEVATE
        </motion.p>
        <motion.p
          className="left-section-detail-home"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          IT'S TIME TO BE HEALTHY AND IN GREAT SHAPE
        </motion.p>
        <motion.button
          className="signup-button-home"
          onClick={handleTakemeaway}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {isAuthenticated ? "WELCOME BACK" : "SIGN UP NOW"}
        </motion.button>
      </motion.div>
      <div className="right-section-home">
        <img
          src={professionalHome}
          alt="fitness"
          className="fitness-image-home"
          loading="lazy"
        />
        <motion.div
          className="circle-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p>Elevate your physical fitness by our workout and diet plans</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
// function CardOfTwo({
//   title1,
//   content1,
//   photo1,
//   path1,
//   buttontext,
//   title2,
//   content2,
//   photo2,
//   path2,
// }) {
//   const navigate = useNavigate();
//   return (
//     <div className="cardoftwo-main-container-home" onLoad={lazy}>
//       <div className="cardoftwo-inner-container-home">
//         <h1>{title1}</h1>
//         <p className="cardoftwo-inner-container-detail-home">{content1}</p>
//         <img src={photo1} alt={title1} loading="lazy"></img>
//         <button className="class-button-home" onClick={() => navigate(path1)}>
//           {buttontext}
//         </button>
//       </div>
//       <div className="cardoftwo-inner-container-home">
//         <h1>{title2}</h1>
//         <p className="cardoftwo-inner-container-detail-home">{content2}</p>
//         <img src={photo2} alt={title2} loading="lazy"></img>
//         <button className="class-button-home" onClick={() => navigate(path2)}>
//           {buttontext}
//         </button>
//       </div>
//     </div>
//   );
// }

function CardOfTwo({
  title1,
  content1,
  photo1,
  path1,
  buttontext,
  title2,
  content2,
  photo2,
  path2,
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="cardoftwo-main-container-home"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className="cardoftwo-inner-container-home"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1>{title1}</h1>
        <p className="cardoftwo-inner-container-detail-home">{content1}</p>
        <img src={photo1} alt={title1} loading="lazy" />
        <motion.button
          className="class-button-home"
          onClick={() => navigate(path1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttontext}
        </motion.button>
      </motion.div>

      <motion.div
        className="cardoftwo-inner-container-home"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h1>{title2}</h1>
        <p className="cardoftwo-inner-container-detail-home">{content2}</p>
        <img src={photo2} alt={title2} loading="lazy" />
        <motion.button
          className="class-button-home"
          onClick={() => navigate(path2)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttontext}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

const ReviewSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const reviewsToShow = 3;

  useEffect(() => {
    const slideInterval = setInterval(() => {
      handleNext();
      setCurrentSlide(
        (prev) => (prev + 1) % (reviews.length - reviewsToShow + 1)
      );
    }, 5000);

    return () => clearInterval(slideInterval); // Cleanup
  }, []);

  const handleNext = () => {
    if (!isAnimating) {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentSlide(
          (next) => (next + 1) % (reviews.length - reviewsToShow + 1)
        );
      }
    }
  };

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(
        (prev) =>
          (prev - 1 + (reviews.length - reviewsToShow + 1)) %
          (reviews.length - reviewsToShow + 1)
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500); // Match CSS transition duration
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleDotClick = (index) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500); // Adjust duration based on your animation
    }
  };

  return (
    <motion.div
      className="slider-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* <h1 className="slider-header">Reviews of our Customers</h1> */}
      <div
        className="slider"
        style={{
          transform: `translateX(-${currentSlide * (100 / reviewsToShow)}%)`,
        }}
      >
        {reviews.map((review, index) => (
          <div className="slide" key={index}>
            <img
              src={review.image}
              alt={review.name}
              className="review-image"
            />
            <div className="review-content">
              <h3>{review.name}</h3>
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="dots-container">
        {Array.from(
          { length: reviews.length - reviewsToShow + 1 },
          (_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          )
        )}
      </div>
    </motion.div>
  );
};
