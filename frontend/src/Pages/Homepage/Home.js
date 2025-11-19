const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
  hamburger.classList.toggle("active");
});

// Sample environment-related posts (replace with backend API)
const forYouPosts = [
  {
    _id: "1",
    text: "Plant a tree today, breathe easy tomorrow 🌳",
    mediaUrl:
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2",
    text: "Sunlight dancing through leaves 🍃",
    mediaUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3",
    text: "Every drop counts. Save water 💧",
    mediaUrl:
      "https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=800&q=80",
  },
];

const trendingPosts = [
  {
    _id: "4",
    text: "Green cities are the future 🌇🌿",
    mediaUrl:
      "https://images.unsplash.com/photo-1526401485004-2fa806b6e41a?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5",
    text: "Let’s make Earth cleaner together 🌍",
    mediaUrl:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6",
    text: "Sustainability isn’t a choice, it’s a lifestyle 🌾",
    mediaUrl:
      "https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=800&q=80",
  },
];

function renderPosts(posts, gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = "";

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card fade-in";
    card.innerHTML = `
          <div class="media">
            <img src="${post.mediaUrl}" alt="Post Image" />
          </div>
          <div class="text">${post.text}</div>
          <div class="actions">
            <button class="btn like"><i class="fa-regular fa-heart"></i> Like</button>
            <button class="btn comment"><i class="fa-regular fa-comment"></i> Comment</button>
            <button class="btn report"><i class="fa-solid fa-flag"></i> Report</button>
          </div>
        `;
    grid.appendChild(card);
  });
}

// Simulate API delay
setTimeout(() => {
  renderPosts(forYouPosts, "forYouGrid");
  renderPosts(trendingPosts, "trendingGrid");
}, 800);
