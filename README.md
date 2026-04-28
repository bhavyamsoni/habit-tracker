# 🚀 Habit Tracker 2

A modern **SaaS-style Habit Tracker Web App** built with Next.js, Supabase, and Tailwind CSS.
Track your daily habits, visualize consistency with a GitHub-style heatmap, and stay accountable.

---

## ✨ Features

* ✅ Create, edit, delete habits
* 🎯 Daily habit tracking (done / missed)
* 📅 GitHub-style heatmap calendar
* 📊 Real-time UI updates (no refresh)
* 🔥 Streak-ready architecture
* 🎨 Clean SaaS UI with animations (Framer Motion)
* 🌙 Dark mode UI
* ⚡ Instant feedback (success animations, validation)

---

## 🧱 Tech Stack

* **Frontend:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Backend / DB:** Supabase
* **Animations:** Framer Motion
* **Deployment:** Vercel / Docker

---

## 📂 Folder Structure

```
habit-tracker2/
│
├── app/                # Next.js App Router
│   ├── api/cron/       # Cron logic for missed habits
│   ├── page.tsx        # Main dashboard
│
├── components/         # UI components
│   ├── AddHabitModal.tsx
│   ├── HabitList.tsx
│   ├── HeatmapCalendar.tsx
│
├── lib/
│   ├── supabase.ts     # Supabase client
│
├── store/
│   ├── useHabitStore.ts
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env.local` in root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🛠️ Installation & Setup

### 1. Clone repo

```
git clone https://github.com/your-username/habit-tracker2.git
cd habit-tracker2
```

### 2. Install dependencies

```
npm install
```

### 3. Run locally

```
npm run dev
```

👉 Open: http://localhost:3000

---

## 🐳 Run with Docker

### Build image

```
docker build -t habit-tracker2 .
```

### Run container

```
docker run -p 3000:3000 \
-e NEXT_PUBLIC_SUPABASE_URL=your_url \
-e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
habit-tracker2
```

---

## 🐳 Docker Compose (Recommended)

```
docker-compose up --build
```

---

## 🧠 How It Works

* Habits are stored in Supabase
* Daily logs track completion status
* Heatmap aggregates completed habits per day
* UI updates instantly using Zustand state

---

## 🔮 Future Improvements

* 🔥 Streak tracking system
* 🔔 Notifications / reminders
* 📱 Mobile PWA support
* 📊 Advanced analytics dashboard
* 👥 Multi-user auth system

---

## 🤝 Contributing

Pull requests are welcome.
If you want to improve UI/UX or add features, go ahead.

---

## 📜 License

MIT License

---

## 💡 Author

Built by Bhavya Soni

---

## ⭐ If you like this project

Give it a star — or don’t, but then don’t complain your habits are trash 😏
