// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

// We'll load the Firebase config from a separate file that's not committed to GitHub
let firebaseConfig;

// Fetch the Firebase config from your Firebase project
fetch('/__/firebase/init.json')
  .then(response => response.json())
  .then(config => {
    // Initialize Firebase with the fetched config
    firebaseConfig = config;
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const analytics = getAnalytics(app);
    
    initializeApp();
  })
  .catch(error => {
    console.error('Error loading Firebase config:', error);
  });


function initializeApp() {
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const analytics = getAnalytics(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const getStartedBtn = document.getElementById('get-started-btn');
const landingPage = document.getElementById('landing-page');
const todoApp = document.getElementById('todo-app');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Current filter
let currentFilter = 'all';

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        landingPage.classList.add('hidden');
        todoApp.classList.remove('hidden');
        loadTasks();
    } else {
        // User is signed out
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        landingPage.classList.remove('hidden');
        todoApp.classList.add('hidden');
    }
});

// Sign in with Google
loginBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
        console.error('Error during sign in:', error);
    });
});

// Sign out
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch(error => {
        console.error('Error during sign out:', error);
    });
});

// Get started button
getStartedBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
        console.error('Error during sign in:', error);
    });
});

// Add new task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        addTask();
    }
});

async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const user = auth.currentUser;
    if (!user) return;

    try {
        // Add to Firestore
        await addDoc(collection(db, 'users', user.uid, 'tasks'), {
            text: taskText,
            completed: false,
            createdAt: serverTimestamp()
        });
        
        taskInput.value = '';
        loadTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Load tasks from Firestore
async function loadTasks() {
    const user = auth.currentUser;
    if (!user) return;

    taskList.innerHTML = '';

    try {
        const tasksQuery = query(
            collection(db, 'users', user.uid, 'tasks'), 
            orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(tasksQuery);
        const tasks = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        
        renderTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Render tasks based on current filter
function renderTasks(tasks) {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="toggle-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        // Toggle task completion
        const toggleBtn = taskItem.querySelector('.toggle-btn');
        toggleBtn.addEventListener('click', () => {
            toggleTaskCompletion(task.id, !task.completed);
        });
        
        // Delete task
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        taskList.appendChild(taskItem);
    });
}

// Toggle task completion status
async function toggleTaskCompletion(taskId, completed) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        await updateDoc(taskRef, { completed });
        loadTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete task
async function deleteTask(taskId) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        await deleteDoc(taskRef);
        loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Set current filter and reload tasks
        currentFilter = btn.getAttribute('data-filter');
        loadTasks();
    });
});


// Add feedback functionality
const feedbackToggle = document.getElementById('feedback-toggle');
const feedbackForm = document.getElementById('feedback-form');
const feedbackText = document.getElementById('feedback-text');
const submitFeedback = document.getElementById('submit-feedback');
const feedbackContainer = document.getElementById('feedback-container');

// Show feedback form when logged in
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        landingPage.classList.add('hidden');
        todoApp.classList.remove('hidden');
        feedbackContainer.classList.remove('hidden');
        loadTasks();
    } else {
        // User is signed out
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        landingPage.classList.remove('hidden');
        todoApp.classList.add('hidden');
        feedbackContainer.classList.add('hidden');
    }
});

// Toggle feedback form
feedbackToggle.addEventListener('click', () => {
    feedbackForm.classList.toggle('hidden');
});

// Submit feedback
submitFeedback.addEventListener('click', async () => {
    const feedback = feedbackText.value.trim();
    if (feedback === '') return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        // Add feedback to Firestore
        await addDoc(collection(db, 'feedback'), {
            userId: user.uid,
            email: user.email,
            feedback: feedback,
            createdAt: serverTimestamp()
        });
        
        feedbackText.value = '';
        feedbackForm.classList.add('hidden');
        
        // Show thank you message
        alert('Thank you for your feedback!');
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
});

// Upgrade button event
const upgradeBtn = document.getElementById('upgrade-btn');
upgradeBtn.addEventListener('click', () => {
    alert('Pro features coming soon! Stay tuned for updates.');
});

}