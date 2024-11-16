# Fitness Web Application
# ELEVATE

Welcome to our **Fitness Web Application (Elevate)**! This project is designed to help users achieve their fitness goals through personalized workout and diet plans while staying motivated through community engagement. The platform is built using a React frontend and a Django REST framework backend with JWT token-based authentication.

## Features

### 🥗 Diet Plan
- **Explore Diet Plans**: Users can browse a variety of pre-defined diet plans tailored to different fitness goals (e.g., weight loss, muscle gain, maintenance).
- **Daily Meal View**: Once a user selects a diet plan, they can view the detailed meal schedule for each day, helping them keep track of their diet seamlessly.

### 🏋️ Workout Plan
- **Custom Workouts**: Users can choose from several structured workout plans focusing on various fitness targets, such as strength training, cardio, or HIIT.
- **Track Progress**: Users can mark exercises as "done" to monitor their workout progress and maintain motivation over time.

### 🌟 Community Engagement
- **Community Posts**: Users can share their fitness journey, ask questions, and post motivational updates to inspire and be inspired by others in the community.
- **Like Posts**: Users can engage with community content by liking posts, building a supportive and interactive environment.

### 🔐 Authentication
- **JWT-Based Authentication**: Secure user login and session management using JSON Web Tokens (JWT). The system includes:
  - **Access Token**: Used for authentication on the platform.
  - **Refresh Token**: Automatically refreshes the access token to ensure seamless user experience.

## Tech Stack

- **Frontend**: React.js (Create React App)
- **Backend**: Django REST Framework
- **Authentication**: JWT (JSON Web Token)
- **Database**: PostgreSQL / SQLite

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [PostgreSQL](https://www.postgresql.org/) (or use SQLite for simpler setups)

### Step-by-Step guide
- git clone https://github.com/abhigupta0507/Elevate.git

### frontend setup
- cd frontend
- npm install i
- npm start

### backend setup
- cd backend
- pip install -r requirements.txt
- python3 manage.py runserver

## Enjoy the app!!!
