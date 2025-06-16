# DevAsset Hub

A modern, developer-focused resource hub for storing and managing all your essential digital assets — from icons to code snippets. Built using Next.js for both frontend and backend, with Clerk for authentication, NeonDB as the database, Drizzle ORM, and ImageKit for secure file storage.

---

## 🚀 Features

- 🔐 User authentication via Clerk
- 📁 Asset uploads (images, icons, code snippets)
- ⭐ Starred items for quick access
- 🗑️ Trash & restore functionality
- ⚡ Fast uploads with ImageKit CDN
- 📱 Responsive UI for mobile and desktop

---

## 🧱 Tech Stack

| Layer          | Tech                     |
| -------------- | ------------------------ |
| Frontend       | Next.js                  |
| Backend        | Next.js API Routes       |
| Authentication | [Clerk](clerk url )      |
| Database       | Neon (PostgreSQL)        |
| ORM            | Drizzle                  |
| File Storage   | [ImageKit](imagekit url) |
| Styling        | Tailwind CSS             |

---

## 📦 Project Structure

devasset-hub/
│
├── app/ # Next.js app directory
├── components/ # Reusable UI components
├── lib/ # Utility functions and API helpers
├── db/ # Drizzle schema and migration scripts
├── public/ # Static assets
├── styles/ # Tailwind & global styles
├── .env.local # Environment variables
├── drizzle.config.ts # Drizzle config
├── next.config.js # Next.js configuration
└── package.json

---

## 📸 Screenshots

> _Add screenshots here after building the UI_

![Dashboard Preview](https://via.placeholder.com/1200x600?text=Dashboard+Screenshot)
![Upload Interface](https://via.placeholder.com/1200x600?text=Upload+Assets)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account
- Neon PostgreSQL database
- ImageKit account

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/devasset-hub.git
   cd devasset-hub
   ```

## Clerk Authentication

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

## ImageKit

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

## Clerk URLs

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

## Fallback URLs

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

## App URL

NEXT_PUBLIC_APP_URL=http://localhost:3000

## Database - Neon PostgreSQL

DATABASE_URL=your_neon_database_url

<!-- Set up your services:
Create a Clerk account and get your API keys
Set up a Neon PostgreSQL database and copy your connection string
Register with ImageKit and get your public/private keys -->

🤝 Contributing
Contributions are welcome! To contribute:
1.Fork the project
2.Create a new branch (git checkout -b feature/your-feature-name)
3.Commit your changes (git commit -m 'Add some feature')
4.Push to the branch (git push origin feature/your-feature-name)
5.Open a pull request

📄 License
This project is licensed under the MIT License.

📬 Contact
For feedback or questions, reach out via email@example.com or open an issue.

🌐 Links
🔗 Clerk
🔗 NeonDB
🔗 ImageKit
🔗 Next.js
