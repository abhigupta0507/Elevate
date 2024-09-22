import "../components/styles/Home.css";
import dietHome from "../images/diet_Home.jpg";
import professionalHome from "../images/professionals_Home.jpg";
import progressImg from "../images/progress_Home.jpg";
import logophoto from "../images/logo_transparent.png";
import "../components/styles/Reviewslider.css";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <div>
      <MainPage />
      <HomepageCard />
      <CardOfTwo />
      <HomepageCard />
      <ReviewSlider />
    </div>
  );
}

function HomepageCard() {
  return (
    <div className="class-studio-container">
      <div className="class-studio-text">
        <h1>DIET PLANS</h1>
        <p>
          Use this space to highlight your most popular services. You can also
          use this for your flagship products.
        </p>
        <button className="class-button">LEARN MORE</button>
      </div>
      <div className="class-studio-video">
        <img
          src={dietHome}
          alt="Workout Class"
          className="class-video-placeholder"
        />
      </div>
    </div>
  );
}

const MainPage = () => {
  return (
    <div className="main-container">
      <div className="left-section">
        <p className="left-section-name">ELEVATE</p>
        <p className="left-section-detail">
          IT'S TIME TO BE HEALTHY AND IN GREAT SHAPE
        </p>
        <button className="signup-button">SIGN UP NOW</button>
      </div>
      <div className="right-section">
        <img src={professionalHome} alt="fitness" className="fitness-image" />
        <div className="circle-text">
          <p>
            Elevate your physical fitness by our workout and diet plans
          </p>
        </div>
      </div>
    </div>
  );
};

function CardOfTwo() {
  return (
    <div className="cardoftwo-main-container">
      <div className="cardoftwo-inner-container">
        <p className="cardoftwo-inner-container-heading">PROGRESS📈</p>
        <p className="cardoftwo-inner-container-detail">
          Track your progress using our graph which displays your daily
          activities and goals
        </p>
        <img src={progressImg} alt="progress"></img>
      </div>
      <div className="cardoftwo-inner-container">
        <p className="cardoftwo-inner-container-heading">BADGES🌟</p>
        <p className="cardoftwo-inner-container-detail">
          Reward yourself with badges given by us to motivate you for completing
          tasks
        </p>
        <img src={dietHome} alt="badges"></img>
      </div>
    </div>
  );
}

// Import your custom CSS

// Sample reviews data stored in an array
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

const ReviewSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const reviewsToShow = 3; // Number of reviews visible at one time

  // Automatically change slide every 5 seconds
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

      {/* Manual Controls */}
      <button className="prev" onClick={handlePrevious}>
        &#10094;
      </button>
      <button className="next" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};
