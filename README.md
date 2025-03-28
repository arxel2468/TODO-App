# SimpleTodo - A Modern Task Management SaaS

<div align="center">

![SimpleTodo Logo](assets/logo.png)

A minimalist, powerful task management application built as a SaaS project. SimpleTodo helps you stay organized with a clean, intuitive interface.

[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Live Demo](https://todo-app-15ce1.web.app) · [Report Bug](https://github.com/yourusername/simpletodo/issues) · [Request Feature](https://github.com/yourusername/simpletodo/issues)

</div>

## ✨ Features

- 🔐 **Secure Authentication**
  - Google Sign-in integration
  - Protected user data
  - Secure API endpoints

- 📝 **Task Management**
  - Create, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Filter tasks by status (All/Active/Completed)
  - Priority levels for tasks

- 🎨 **Modern UI/UX**
  - Clean, minimalist design
  - Fully responsive layout
  - Dark/Light mode support
  - Intuitive navigation

- 💎 **Premium Features**
  - Task categories
  - Due dates and reminders
  - Task sharing
  - Advanced analytics

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- A Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arxel2468/simpletodo.git
   cd simpletodo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase
   firebase init
   ```

4. **Configure Firebase**
   - Create a new project in [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Set up Firestore Database
   - Copy your Firebase config to `firebase-config.js`

5. **Update Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/tasks/{taskId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /feedback/{feedbackId} {
         allow create: if request.auth != null;
         allow read, update, delete: if false;
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

## 🛠️ Development

```bash
# Start local development server
firebase serve

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## 📁 Project Structure

```
simpletodo/
├── assets/           # Images, icons, and other static files
├── css/             # Stylesheets
│   ├── styles.css   # Main application styles
│   └── landing.css  # Landing page styles
├── js/              # JavaScript files
│   └── app.js       # Main application logic
├── pages/           # HTML pages
│   ├── index.html   # Main application
│   ├── landing.html # Landing page
│   └── privacy.html # Privacy policy
└── firebase-config.js # Firebase configuration
```

## 🔒 Security

- All user data is encrypted in transit and at rest
- Firebase Security Rules protect all database operations
- Regular security audits and updates
- GDPR compliant

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the MIT(LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Backend services and hosting
- [Font Awesome](https://fontawesome.com/) - Beautiful icons
- [Google Fonts](https://fonts.google.com/) - Typography
- All contributors who have helped shape SimpleTodo

---

<div align="center">
Made with ❤️ by Amit Pandit(https://github.com/arxel2468)
</div>