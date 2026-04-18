# 🚀 CV Genius AI

An AI-powered web application that helps users generate **professional, ATS-friendly CVs** instantly using modern web technologies and AI.

🔗 Live Demo: https://cv-genius-ai-ten.vercel.app/

---

## ✨ Features

* 🤖 **AI CV Generation** – Generate high-quality CV content using AI (Gemini/OpenAI)
* 📝 **Dynamic Form Input** – Users can input personal, educational, and professional details
* 🎯 **ATS-Friendly Output** – Optimized resumes for job applications
* 🔐 **Authentication System** – Secure login/signup using NextAuth
* 💳 **Stripe Integration** – Payment system for premium features
* 📧 **Email System** – SMTP-based email notifications
* ⚡ **Fast & Responsive UI** – Built with Next.js and optimized for performance
* ☁️ **Deployed on Vercel** – Seamless deployment and scalability

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Node.js (API Routes)
* **Database:** MongoDB
* **Authentication:** NextAuth.js
* **AI Integration:** Gemini API / OpenAI API
* **Payments:** Stripe
* **Email:** Nodemailer (SMTP)
* **Deployment:** Vercel

---

## 📦 Installation & Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/cv-genius-ai.git
cd cv-genius-ai
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Database
MONGODB_URI=your_mongodb_uri

# Authentication (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI (Gemini or OpenAI)
GEMINI_API_KEY=your_gemini_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="CV Genius AI <your_email@gmail.com>"
```

---

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## 🔑 How It Works

1. User signs up / logs in
2. Fills CV details via form
3. AI generates professional content
4. User previews and downloads CV
5. Optional: Payment unlocks premium features

---

## 💳 Stripe Webhook Setup

For payments to work locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🌐 Deployment

This project is deployed on **Vercel**.

To deploy your own:

1. Push code to GitHub
2. Import project into Vercel
3. Add environment variables
4. Deploy 🚀

---

## 📸 Screenshots (Optional)

*Add screenshots of your UI here to make the repo more attractive*

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Haris Laeeq**

* Full Stack Developer (MERN + Next.js)
* Passionate about building scalable web applications

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
