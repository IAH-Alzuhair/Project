// DOM Elements
const adminBtn = document.getElementById('admin-btn');
const adminModal = document.getElementById('admin-modal');
const submitPassword = document.getElementById('submit-password');
const adminPassword = document.getElementById('admin-password');
const exitAdmin = document.getElementById('exit-admin');
const blogPosts = document.getElementById('blog-posts');
const addPostSection = document.getElementById('add-post-section');
const postForm = document.getElementById('post-form');
const themeToggle = document.getElementById('theme-toggle');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

// Track admin mode state
let adminMode = false;

// Admin modal functionality
adminBtn.addEventListener('click', () => {
  adminModal.style.display = 'block';
});

// Submit password and grant access
submitPassword.addEventListener('click', () => {
  const password = adminPassword.value;
  if (password === 'admin123') {
    adminMode = true;
    addPostSection.style.display = 'block';
    adminModal.style.display = 'none';
    alert('Admin access granted.');
  } else {
    alert('Incorrect password.');
  }
});

// Exit admin mode
exitAdmin.addEventListener('click', () => {
  adminMode = false;
  addPostSection.style.display = 'none';
  adminModal.style.display = 'none';
  alert('Admin mode exited.');
});

// Add new blog post functionality
postForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('post-title').value;
  const date = document.getElementById('post-date').value;
  const body = document.getElementById('post-body').value;
  const imageInput = document.getElementById('post-image');
  const image = imageInput.files.length > 0 ? imageInput.files[0] : null;

  // Validate form input
  if (!title || !body || !date) {
    alert('Please fill in all required fields.');
    return;
  }

  // Create new blog post element
  const post = document.createElement('div');
  post.classList.add('carousel-item');
  
  // Create post content
  post.innerHTML = `
    <h3>${title}</h3>
    <p><strong>Date:</strong> ${date}</p>
    <p>${body}</p>
    ${image ? `<img src="${URL.createObjectURL(image)}" alt="${title}" style="max-width: 100%; border-radius: 10px;">` : ''}
    <button class="delete-btn">❌</button>
  `;
  
  // Add delete functionality to the new post
  post.querySelector('.delete-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this post?')) {
      blogPosts.removeChild(post);
      // Update slides array and show first slide if we deleted the current one
      updateSlides();
      if (slides.length > 0) {
        showSlide(0);
      }
      updateSlideCounter();
    }
  });
  
  // Add the new post to the blog posts container
  blogPosts.appendChild(post);
  
  // Update slides array to include the new post
  updateSlides();
  
  // Show the newly added slide
  showSlide(slides.length - 1);
  
  // Reset the form
  postForm.reset();
  
  alert('Blog post added successfully!');
});

// Enhanced Carousel functionality with transitions
let currentSlide = 0;
let slides = document.querySelectorAll('.carousel-item');
let isAnimating = false;

// Function to update slides array after adding or removing posts
function updateSlides() {
  slides = document.querySelectorAll('.carousel-item');
}

// Function to show a specific slide with transition
function showSlide(index) {
  // Make sure we have slides to display
  if (slides.length === 0) {
    return;
  }
  
  // Prevent rapid clicking during animation
  if (isAnimating) {
    return;
  }
  
  isAnimating = true;
  
  // Handle index bounds
  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }
  
  // Remove active class from all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Add active class to current slide
  slides[currentSlide].classList.add('active');
  
  // Update count indicator
  updateSlideCounter();
  
  // Reset animating flag after transition completes
  setTimeout(() => {
    isAnimating = false;
  }, 500); // Match this with the CSS transition time
}

// Function to update slide counter
function updateSlideCounter() {
  const counter = document.getElementById('slide-counter');
  if (counter && slides.length > 0) {
    counter.textContent = `${currentSlide + 1} / ${slides.length}`;
  }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
  updateSlides();
  
  // Set initial active state for first slide
  if (slides.length > 0) {
    slides[0].classList.add('active');
    updateSlideCounter();
  }
  
  // Add delete functionality to any existing posts
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete this post?')) {
        const post = this.closest('.carousel-item');
        blogPosts.removeChild(post);
        updateSlides();
        if (slides.length > 0) {
          showSlide(0);
        }
        updateSlideCounter();
      }
    });
  });
});

// Previous button functionality
prevBtn.addEventListener('click', () => {
  showSlide(currentSlide - 1);
});

// Next button functionality
nextBtn.addEventListener('click', () => {
  showSlide(currentSlide + 1);
});

// Add keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    showSlide(currentSlide - 1);
  } else if (e.key === 'ArrowRight') {
    showSlide(currentSlide + 1);
  }
});

// Update script.js to persist blog posts
document.addEventListener('DOMContentLoaded', () => {
  // Load existing posts from localStorage
  loadPostsFromStorage();

  // Add new blog post functionality
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const date = document.getElementById('post-date').value;
    const body = document.getElementById('post-body').value;
    const imageInput = document.getElementById('post-image');
    
    // Validate form input
    if (!title || !body || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create post data object
    const postData = {
      title,
      date,
      body,
      image: null // We can't store actual files in localStorage
    };

    // Add the post to DOM and storage
    addPostToDOM(postData);
    savePostToStorage(postData);
    
    // Reset the form
    postForm.reset();
    
    alert('Blog post added successfully!');
  });
});

// Function to add post to DOM
function addPostToDOM(postData) {
  const post = document.createElement('div');
  post.classList.add('carousel-item');
  
  // Create post content with date
  post.innerHTML = `
    <h3>${postData.title}</h3>
    <p><strong>Date:</strong> ${postData.date}</p>
    <p>${postData.body}</p>
    ${postData.image ? `<img src="${postData.image}" alt="${postData.title}" style="max-width: 100%; border-radius: 10px;">` : ''}
    <button class="delete-btn">❌</button>
  `;
  
  // Add delete functionality
  post.querySelector('.delete-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this post?')) {
      blogPosts.removeChild(post);
      removePostFromStorage(postData);
      updateSlides();
      if (slides.length > 0) {
        showSlide(0);
      }
    }
  });
  
  // Add to blog posts container
  blogPosts.appendChild(post);
  
  // Update slides array and show the new post
  updateSlides();
  showSlide(slides.length - 1);
}

// Function to save post to localStorage
function savePostToStorage(postData) {
  let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts.push(postData);
  localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Function to remove post from localStorage
function removePostFromStorage(postData) {
  let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts = posts.filter(post => post.title !== postData.title || post.date !== postData.date);
  localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Function to load posts from localStorage
function loadPostsFromStorage() {
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts.forEach(post => {
    addPostToDOM(post);
  });
}