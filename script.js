// DOM Elements
const newsdetails = document.getElementById("newsdetails");
const searchBtn = document.getElementById("search");
const newsquery = document.getElementById("newsquery");
const navLinks = document.querySelectorAll(".nav-link");
const scrollTopBtn = document.getElementById("scrollTop");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

// API Setup
const API_KEY = "pub_19438e432335ef1317ed1c8b1db3abe4e3d3a";
const BASE = `https://newsdata.io/api/1/news?language=en&country=in&apikey=${API_KEY}`;

const ENDPOINTS = {
    HEADLINES: BASE,
    GENERAL: `${BASE}&category=health`,
    SPORTS: `${BASE}&category=sports`,
    TECHNOLOGY: `${BASE}&category=technology`,
    ENTERTAINMENT: `${BASE}&category=entertainment`,
    SEARCH: `${BASE}&q=`
};

const CATEGORY_INFO = {
    HEADLINES: { title: "Headlines", subtitle: "Latest news from India" },
    GENERAL: { title: "Health", subtitle: "Health and wellness updates" },
    SPORTS: { title: "Sports", subtitle: "Latest sports coverage" },
    TECHNOLOGY: { title: "Technology", subtitle: "Tech and innovation news" },
    ENTERTAINMENT: { title: "Entertainment", subtitle: "Entertainment updates" }
};

// Skeleton Loader
function showSkeleton() {
    newsdetails.setAttribute('aria-busy', 'true');
    newsdetails.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        newsdetails.innerHTML += `
            <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                <div class="skeleton-card">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-body">
                        <div class="skeleton-line title"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
            </div>`;
    }
}

// Fetch Function with Error Handling
async function fetchNews(url, retries = 3) {
    showSkeleton();

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                },
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "error") {
                throw new Error(data.results?.message || "API Error");
            }

            setTimeout(() => displayNews(data.results || []), 300);
            return;

        } catch (error) {
            console.error(`Fetch attempt ${i + 1} failed:`, error);

            if (i === retries - 1) {
                displayError(error.message);
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
}

// Display Error
function displayError(message) {
    newsdetails.setAttribute('aria-busy', 'false');
    newsdetails.innerHTML = `
        <div class="col-12">
            <div class="alert-custom">
                <i class="bi bi-exclamation-triangle"></i>
                <h5>Oops! Something went wrong</h5>
                <p>${escapeHtml(message || "Failed to fetch news. Please try again later.")}</p>
                <button class="btn btn-warning mt-3" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise"></i> Retry
                </button>
            </div>
        </div>`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return "Unknown date";

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return "Unknown date";
    }
}

// Get category badge
function getCategoryBadge(category) {
    const categories = {
        technology: '<span class="news-category-badge">Tech</span>',
        sports: '<span class="news-category-badge">Sports</span>',
        entertainment: '<span class="news-category-badge">Entertainment</span>',
        health: '<span class="news-category-badge">Health</span>',
        business: '<span class="news-category-badge">Business</span>'
    };
    return categories[category?.toLowerCase()] || '';
}

// Display News
function displayNews(arr) {
    newsdetails.setAttribute('aria-busy', 'false');
    newsdetails.innerHTML = "";

    if (!arr || !Array.isArray(arr) || arr.length === 0) {
        newsdetails.innerHTML = `
            <div class="col-12">
                <div class="alert-custom">
                    <i class="bi bi-search"></i>
                    <h5>No Results Found</h5>
                    <p>We couldn't find any news articles matching your criteria. Try a different search or category.</p>
                </div>
            </div>`;
        return;
    }

    arr.forEach((news, index) => {
        if (!news) return;

        const img = news.image_url || "https://via.placeholder.com/400x250/1a1a1a/ffffff?text=No+Image+Available";
        const title = escapeHtml(news.title || "No Title Available");
        const desc = escapeHtml(news.description || "No description available for this article.");
        const date = formatDate(news.pubDate);
        const link = news.link || "#";
        const source = escapeHtml(news.source_id || "Unknown Source");
        const category = getCategoryBadge(news.category?.[0]);

        newsdetails.innerHTML += `
            <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                <article class="news-card">
                    <div class="news-img-wrapper">
                        <img src="${img}" 
                             class="news-img" 
                             alt="${title}"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Image+Not+Found'">
                        ${category}
                    </div>
                    
                    <div class="news-body">
                        <div class="news-meta">
                            <span class="news-source">
                                <i class="bi bi-building"></i>
                                ${source}
                            </span>
                            <span class="news-date">
                                <i class="bi bi-clock"></i>
                                ${date}
                            </span>
                        </div>
                        
                        <h2 class="news-title">${title}</h2>
                        <p class="news-desc">${desc}</p>

                        <div class="news-footer">
                            <a href="${link}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="btn-read-more"
                               aria-label="Read full article: ${title}">
                                Read More <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });
}

// Update Page Title
function updatePageTitle(category) {
    const info = CATEGORY_INFO[category] || CATEGORY_INFO.HEADLINES;
    pageTitle.textContent = info.title;
    pageSubtitle.textContent = info.subtitle;
}

// Active Highlight
function setActive(el) {
    navLinks.forEach(n => n.classList.remove("active-tab"));
    el.classList.add("active-tab");
}

// Category Click Events
navLinks.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        setActive(btn);
        const id = btn.id.toUpperCase();
        updatePageTitle(id);
        fetchNews(ENDPOINTS[id]);
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Close mobile menu if open
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Search Functionality
function performSearch() {
    const query = newsquery.value.trim();
    if (!query) {
        alert("Please enter a search term");
        return;
    }

    updatePageTitle("SEARCH");
    pageTitle.textContent = `Search Results for "${query}"`;
    pageSubtitle.textContent = "Showing relevant news articles";

    setActive(document.getElementById("headlines"));
    fetchNews(`${ENDPOINTS.SEARCH}${encodeURIComponent(query)}`);

    // Close mobile menu if open
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
    }
}

searchBtn.addEventListener("click", performSearch);

// Enter key for search
newsquery.addEventListener("keyup", e => {
    if (e.key === "Enter") performSearch();
});

// Scroll to Top Button
window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Service Worker for offline support (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to register service worker
        // navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    fetchNews(ENDPOINTS.HEADLINES);
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    displayError('No internet connection. Please check your network and try again.');
});

// Prevent form submission on search
const searchForm = document.querySelector('.search-wrapper');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}