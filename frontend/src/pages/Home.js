import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Home.css";
import "../components/styles/Reviewslider.css";
import dietHome from "../images/diet_Home.jpg";
import professionalHome from "../images/professionals_Home.jpg";
import progressImg from "../images/progress_Home.png";
import BadgeImg from "../images/badge_Home.png";
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
      <div className="Progress-Home">
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

      <div className="Progress-Home">
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
  return <h1 className="heading-text">{text}</h1>;
}
function DescribeBlockCard({ title, content, photo, buttontext, path }) {
  const navigate = useNavigate();

  return (
    <div className="class-studio-container">
      <div className="class-studio-text">
        <h1>{title}</h1>
        <p>{content}</p>
        <button className="class-button" onClick={() => navigate(path)}>
          {buttontext}
        </button>
      </div>
      <div className="class-studio-video">
        <img
          src={photo}
          alt="Workout Class"
          className="class-video-placeholder"
          loading="lazy"
        />
      </div>
    </div>
  );
}

const MainPage = ({ isAuthenticated, navigate }) => {
  function handleTakemeaway() {
    if (!isAuthenticated) navigate("/login");
    else navigate("/dashboard");
  }
  return (
    <div className="main-container">
      <div className="left-section">
        <p className="left-section-name">ELEVATE</p>
        <p className="left-section-detail">
          IT'S TIME TO BE HEALTHY AND IN GREAT SHAPE
        </p>
        <button className="signup-button" onClick={handleTakemeaway}>
          {isAuthenticated ? "WELCOME BACK" : "SIGN UP NOW"}
        </button>
      </div>
      <div className="right-section">
        <img
          src={professionalHome}
          alt="fitness"
          className="fitness-image"
          loading="lazy"
        />
        <div className="circle-text">
          <p>Elevate your physical fitness by our workout and diet plans</p>
        </div>
      </div>
    </div>
  );
};

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
    <div className="cardoftwo-main-container" onLoad={lazy}>
      <div className="cardoftwo-inner-container">
        <h1>{title1}</h1>
        <p className="cardoftwo-inner-container-detail">{content1}</p>
        <img src={photo1} alt={title1} loading="lazy"></img>
        <button className="class-button" onClick={() => navigate(path1)}>
          {buttontext}
        </button>
      </div>
      <div className="cardoftwo-inner-container">
        <h1>{title2}</h1>
        <p className="cardoftwo-inner-container-detail">{content2}</p>
        <img src={photo2} alt={title2} loading="lazy"></img>
        <button className="class-button" onClick={() => navigate(path2)}>
          {buttontext}
        </button>
      </div>
    </div>
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
    <div className="slider-container">
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

      {/* <button className="prev" onClick={handlePrevious}>
        &#10094;
      </button>
      <button className="next" onClick={handleNext}>
        &#10095;
      </button> */}

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
    </div>
  );
};
