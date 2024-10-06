import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Home.css";
import "../components/styles/Reviewslider.css";
import dietHome from "../images/diet_Home.jpg";
import professionalHome from "../images/professionals_Home.jpg";
import progressImg from "../images/progress_Home.jpg";

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
  return (
    <div>
      <MainPage isAuthenticated={isAuthenticated} navigate={navigate} />
      <DescribeBlockCard
        title="DIET PLANS"
        content="Discover personalized diet plans tailored to your goals—whether you're aiming for weight loss, muscle gain, or maintaining a balanced lifestyle. Choose from vegan, vegetarian, or non-vegan options to fuel your journey and track your daily progress"
        photo={dietHome}
        buttontext="LEARN MORE"
        path="/Diet"
      />
      <CardOfTwo
        title1="PROGRESS📈"
        content1="Track your progress using our graph which displays your daily
          activities and goals"
        photo1={progressImg}
        title2="BADGES🌟"
        content2="Reward yourself with badges given by us to motivate you for completing
          tasks"
        photo2={dietHome}
      />
      <DescribeBlockCard
        title="WORKOUT PLANS"
        content="Transform your fitness with structured workout plans designed for every level. From beginner to advanced routines, follow exercises tailored to your body and track calories burned as you progress toward your goals"
        photo={dietHome}
        buttontext="LEARN MORE"
        path="/Workout"
      />
      <ReviewSlider />
    </div>
  );
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
        />
      </div>
    </div>
  );
}

const MainPage = ({ isAuthenticated, navigate }) => {
  function handleTakemeaway() {
    navigate("/login");
  }
  return (
    <div className="main-container">
      <div className="left-section">
        <p className="left-section-name">ELEVATE</p>
        <p className="left-section-detail">
          IT'S TIME TO BE HEALTHY AND IN GREAT SHAPE
        </p>
        <button className="signup-button" onClick={handleTakemeaway}>
          {isAuthenticated ? "" : "SIGN UP NOW"}
        </button>
      </div>
      <div className="right-section">
        <img src={professionalHome} alt="fitness" className="fitness-image" />
        <div className="circle-text">
          <p>Elevate your physical fitness by our workout and diet plans</p>
        </div>
      </div>
    </div>
  );
};

function CardOfTwo({ title1, content1, photo1, title2, content2, photo2 }) {
  return (
    <div className="cardoftwo-main-container">
      <div className="cardoftwo-inner-container">
        <p className="cardoftwo-inner-container-heading">{title1}</p>
        <p className="cardoftwo-inner-container-detail">{content1}</p>
        <img src={photo1} alt={title1}></img>
      </div>
      <div className="cardoftwo-inner-container">
        <p className="cardoftwo-inner-container-heading">{title2}</p>
        <p className="cardoftwo-inner-container-detail">{content2}</p>
        <img src={photo2} alt={title2}></img>
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
    }, 3000);

    return () => clearInterval(slideInterval); // Cleanup
  }, [currentSlide]);

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true); // Wrap around
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

  // Reset animation flag when slide changes
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500); // Match CSS transition duration
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className="slider-container">
      <h1 className="slider-header">Reviews of our Customers</h1>
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

      <button className="prev" onClick={handlePrevious}>
        &#10094;
      </button>
      <button className="next" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};
