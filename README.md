# ✨ LUMINAE
### Delhi's Premier Bridal Beauty Booking Platform

<div align="center">

![LUMINAE Banner](https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200)

**Find Your Glow in Delhi**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-luminae--bay.vercel.app-C9A84C?style=for-the-badge&logo=vercel)](https://luminae-bay.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Naitik--xd%2Fluminae-181717?style=for-the-badge&logo=github)](https://github.com/Naitik-xd/luminae)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Supabase-61DAFB?style=for-the-badge&logo=react)](https://luminae-bay.vercel.app)

*Built for SuperXgen AI Startup Buildathon 2026 — Delhi Bridal Beauty Booking Platform Challenge*

</div>

---

## 🌟 About LUMINAE

LUMINAE is a city-based luxury beauty salon marketplace built for Delhi. It connects customers with the finest bridal and beauty salons across Connaught Place, Rohini, and South Delhi — powered by an AI stylist that gives personalized recommendations based on your hair and skin needs.

This is not just a booking platform. It is a full startup-grade product built entirely using AI tools in under 5 days.

---

## 🚀 Live Demo

🌐 **[luminae-bay.vercel.app](https://luminae-bay.vercel.app)**

| Credential | Value |
|---|---|
| Admin Email | naitik.270810@outlook.com |
| Admin Panel | Scroll to footer → Admin Access |
| AI Stylist | Navbar → Meet LUMI |

---

## 📸 Features

### 🏠 Immersive Landing Page
- Cinematic video hero section with animated LUMINAE branding
- Floating gold particle effects
- Smooth scroll animations powered by Framer Motion and GSAP
- Dark and Light mode toggle with smooth theme transitions

### 💇 Salon Discovery
- 25 real Delhi salons across CP, Rohini and South Delhi
- Filter by area and speciality
- Sticky search bar with live filtering
- 3D tilt hover effects on salon cards
- Bridal specialist badges and featured salon highlights

### 📅 Appointment Booking
- Premium multi-step booking form
- Real-time service fetching per salon
- Input validation with animated feedback
- Instant booking confirmation screen
- Automated email on booking via Resend

### 🤖 LUMI — AI Stylist
- Powered by Gemini 2.5 Flash Lite
- Personalized salon recommendations based on hair and skin concerns
- Inline booking form inside chat — zero token waste
- Smart suggested prompts for quick interactions
- Fallback handling for API rate limits

### 🔐 Authentication
- Google OAuth via Supabase
- Email and password login
- Protected booking and profile routes
- Session persistence across pages

### 👑 Admin Dashboard
- Whitelist-based access for authorized emails only
- Real-time booking updates via Supabase subscriptions
- Status management — Pending, Confirmed, Cancelled, Completed
- Automated status update emails to customers
- Stat cards with total, pending, confirmed and completed counts
- Dual horizontal scrollbar for easy table navigation

### 📧 Email Notifications
- Booking received email with pending status
- Appointment confirmed email on admin approval
- Cancellation email with apology message
- Completion email with thank you note
- All emails branded with LUMINAE identity via Resend

### 👤 Customer Portal
- My Bookings page with full booking history
- Status badges per booking
- Modify date and time for pending bookings
- Cancel bookings directly from portal

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Custom Design System |
| Animations | Framer Motion + GSAP |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| AI Chatbot | Google Gemini 2.5 Flash Lite API |
| Email | Resend API |
| Hosting | Vercel |
| Version Control | GitHub |
| Built With | Google AI Studio |

---

## 🏗️ Architecture

```
React Frontend (Vite)
       ↓
   Vercel CDN
       ↓
  Supabase Auth  →  Google OAuth + Email/Password
  Supabase DB    →  PostgreSQL (salons, services, bookings, users, admins, reviews)
  Supabase Edge  →  send-booking-confirmation + send-status-update
       ↓
  Gemini API     →  LUMI AI Stylist Chat
  Resend API     →  Transactional Emails
```

---

## 🗄️ Database Schema

```
salons       →  25 real Delhi salons with area, speciality, best_for tags
services     →  4-6 services per salon with price in INR and duration
users        →  Customer profiles linked to Supabase Auth
bookings     →  Full booking record with status tracking
admins       →  Whitelisted admin emails
reviews      →  Customer reviews with ratings
```

---

## 🌆 Salons Covered

### Connaught Place
Looks Salon · Enrich Salon · Naturals Salon · Affinity Salon · Green Trends · VLCC Wellness · Lakmé Salon · YLG Salon

### Rohini
Jawed Habib · Looks Salon Rohini · Naturals Rohini · Affinity Rohini · Glamour Studio · Pink Root Salon · Studio 11 · Scissors and Shades · Glam Affair

### South Delhi
Lakmé Salon GK · Bodycraft Salon · Enrich Lajpat · Jean Claude Biguine · Strands Salon · Mirrors Salon · Gloss Salon · Juice Salon · Toni and Guy

---

## ⚙️ Environment Variables

Create a `.env` file in the root with these variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Supabase Edge Function secrets:
```
RESEND_API_KEY=your_resend_api_key
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Naitik-xd/luminae.git

# Navigate to project
cd luminae

# Install dependencies
npm install

# Add environment variables
cp .env.example .env
# Fill in your keys in .env

# Start development server
npm run dev
```

---

## 🤖 AI Tools Used

| Tool | How It Was Used |
|---|---|
| **Google AI Studio** | Primary code generation for entire frontend and backend integration |
| **Gemini 2.5 Flash Lite** | Powers the LUMI AI Stylist chatbot for personalized salon recommendations |
| **Claude (Anthropic)** | High level prompting strategy, architecture decisions, debugging guidance throughout the build |

---

## 📁 Project Structure

```
luminae/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # Theme and Auth context
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Supabase client setup
│   ├── pages/           # All route pages
│   │   ├── Home.tsx
│   │   ├── Salons.tsx
│   │   ├── SalonDetail.tsx
│   │   ├── Booking.tsx
│   │   ├── AIStylist.tsx
│   │   ├── Admin.tsx
│   │   ├── MyBookings.tsx
│   │   └── Auth.tsx
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── functions/
│       ├── send-booking-confirmation/
│       └── send-status-update/
├── .env.example
├── vercel.json
└── README.md
```

---

## 🏆 Hackathon Submission

This project was built for the **SuperXgen AI Startup Buildathon 2026** — Delhi Bridal Beauty Booking Platform Challenge.

| Criteria | Implementation |
|---|---|
| **Product Thinking** | Real Delhi salons, real use case, end to end booking flow |
| **UI/UX Design** | Awwwards-inspired immersive design, dual theme, cinematic animations |
| **AI Usage** | Gemini powered LUMI stylist with personalized recommendations + inline booking |
| **Execution Quality** | Full stack — React, Supabase, Edge Functions, automated emails, admin panel |
| **User Experience** | Mobile responsive, smooth animations, real-time updates, email confirmations |

---

## 👨‍💻 Built By

**Naitik Agarwal**
- GitHub: [@Naitik-xd](https://github.com/Naitik-xd)

---

## 📄 License

This project was built for hackathon purposes as part of SuperXgen AI Startup Buildathon 2026.

---

<div align="center">

**✨ LUMINAE — Find Your Glow in Delhi ✨**

*Built with AI. Powered by passion. Made for Delhi.*

</div>
