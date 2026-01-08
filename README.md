📘 LinkNest
LinkNest is a modern, full-stack MERN application that allows creators, freelancers, and professionals to consolidate all of their online links into a single, customizable bio page—similar to Linktree, but built from scratch with full control and extensibility.

🚀 Live Concept
One link. Infinite possibilities.
Share your entire digital presence with a single URL.

🌟 Introduction
Most social platforms allow only one bio link, forcing creators to constantly switch URLs.
LinkNest solves this by providing:
A single shareable bio link
Fully customizable design
Drag-and-drop link management
Built-in analytics & QR codes

✨ Features
Core Features
🔐 JWT Authentication & Authorization
🔗 Unlimited links with drag & drop reordering
🎨 Full theme customization (colors, fonts, buttons)
🖼️ Profile image uploads
📊 Analytics dashboard (views, clicks, devices)
📱 Mobile-optimized public bio pages
📎 QR code generation for easy sharing

Advanced UX
Smooth animations (Framer Motion)
Real-time preview
Instant theme updates
Responsive layout

🧰 Tech Stack
Frontend
React 18 + Vite
React Router v6
Tailwind CSS
Framer Motion
React Beautiful DnD
Chart.js
Axios
QRCode.react
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
bcryptjs
Multer (file uploads)
Express Validator
Rate Limiting & CORS

🏗️ Architecture
LinkNest follows a clean MERN architecture:
RESTful API backend
JWT-based stateless authentication
Component-driven frontend
Public & protected routes
Aggregated analytics pipeline

📁 Project Structure
LinkNest/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   └── main.jsx
    └── package.json


⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/linknest.git
cd linknest

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

▶️ Usage
Register or log in
Customize your profile & theme
Add, edit, reorder links
Share your public URL:
/u/yourusername
Track performance via analytics dashboard

🔒 Security
JWT-based authentication
Password hashing with bcrypt
Protected routes middleware
Input sanitization & validation
Rate limiting against brute force attacks
Secure file upload validation

🗄️ Database Schema
User
Profile info
Theme settings
Authentication credentials
Link
Title, URL, order
Click tracking
Active state
Analytics
Page views
Link clicks
Device type tracking

🔄 API & Data Flow
Authentication Flow
Register/Login
JWT issued
Token attached to protected requests
Public Bio Flow
/u/:username
Fetch user + links
Render optimized public page
Analytics Flow
Page views & link clicks tracked automatically
Aggregated for dashboard insights

⚡ Performance Optimizations
Frontend
Code splitting
Lazy loading images
Memoization
Tailwind CSS purge
Backend
Indexed MongoDB queries
Lean queries
Aggregation pipelines
Rate limiting

🧪 Testing
Manual testing checklist includes:
Authentication
Link CRUD operations
Drag & drop reordering
Theme preview accuracy
Analytics tracking
QR code generation

🛣️ Roadmap
✅ MVP Complete
Authentication
Link management
Theming
Analytics
QR codes

🔄 In Progress
Email verification
Password reset

📈 Planned
Custom domains
Advanced analytics
Team collaboration
Integrations (YouTube, Spotify, Instagram)
Pro subscription tiers

Built with passion using the MERN stack.
Inspired by modern creator tools and real-world needs.

Last Updated: January 2026
Maintained by: Prashant Ahirwar 🚀
