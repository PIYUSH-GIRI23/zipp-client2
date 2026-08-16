<div align="center">

# 🖥️ ZIPP Client  
### The official front-end for the **ZIPP Ecosystem** — built with **React**, **Vite**, and **Tailwind CSS**.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br>

💡 **Official Repository:**  
👉 [ZIPP — GitHub Repository](https://github.com/PIYUSH-GIRI23/zipp)

</div>

---

## 🚀 Features

- ⚡ **Vite-Powered React App** — Lightning-fast development and optimized builds  
- 🎨 **Tailwind CSS** — Fully responsive and modern UI styling  
- 🔐 **Authentication Integration** — Securely connects with ZIPP Auth microservice  
- 📋 **Clipboard System** — Upload, manage, and view media/text clips easily  
- 🧩 **Modular Architecture** — Cleanly separated components and controllers  
- 🧠 **Smart Plan Limits** — Real-time limit tracking synced with backend services  
- 📧 **Mail Verification & Account Management** — Integrated modals and flows  
- 🌗 **Custom Modals** — Modular UI with reusable modal components  
- ☁️ **Vercel Ready** — Optimized for deployment and scaling  

---

## 🧱 Project Structure

<pre>
zipp-client2/
├── node_modules/                # Installed dependencies
│
├── public/                      # Public assets
│   └── icon.png                 # App icon
│
├── src/                         # Source code
│   ├── assets/                  # Static assets (images, icons, etc.)
│   │
│   ├── components/              # Main UI components
│   │   ├── account/             # Account management UI
│   │   │   ├── modal/           # Account-related modals
│   │   │   │   ├── Boost.jsx
│   │   │   │   ├── DeleteConfirmation.jsx
│   │   │   │   ├── PinAccess.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   ├── VerifyMail.jsx
│   │   │   │   ├── Account.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── auth/                # Authentication screens
│   │   │   ├── Auth.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── Clipboard/           # Clipboard management UI
│   │   │   ├── components/
│   │   │   │   └── MediaCard.jsx
│   │   │   ├── modals/
│   │   │   │   ├── Filemodal.jsx
│   │   │   │   ├── Imagemodal.jsx
│   │   │   │   ├── Textmodal.jsx
│   │   │   │   ├── datamodal/
│   │   │   │   │   ├── DeleteModal.jsx
│   │   │   │   │   ├── FallbackModal.jsx
│   │   │   │   │   ├── FileShowModal.jsx
│   │   │   │   │   ├── ImageShowModal.jsx
│   │   │   │   │   └── TextShowModal.jsx
│   │   │   ├── Homepage.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   └── Dashboard.jsx         # Global dashboard view
│   │
│   ├── controller/              # Business logic / app control
│   │   ├── authController.js
│   │   ├── manageSession.js
│   │   └── modalController.js
│   │
│   ├── utils/                   # Helper functions
│   │   └── findLimits.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env                         # Environment variables
├── .env.config                  # Example environment config
├── .gitignore                   # Git ignored files
├── index.html                   # App root HTML
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── Readme.md                    # This file ❤️
</pre>

---

## ⚙️ Setup & Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/PIYUSH-GIRI23/zipp-client2.git

# 2️⃣ Move into the directory
cd zipp-client2

# 3️⃣ Install dependencies
npm install

# 4️⃣ Configure environment variables
cp .env.config .env

# 5️⃣ Start the development server
npm run dev


--- 
🌐 Connect with Me

<a href="mailto:giri.piyush2003@gmail.com"><img src="https://img.shields.io/badge/Mail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Mail"></a>
<a href="https://github.com/PIYUSH-GIRI23"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
<a href="https://www.linkedin.com/in/piyush-giri-031b71254/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
