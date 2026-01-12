// ============================================
// READING PROGRESS BAR
// ============================================

document.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    document.getElementById('readingProgress').style.width = scrollPercent + '%';
});


// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    updateThemeButton(newTheme);
}

/**
 * Update theme button text and icon
 */
function updateThemeButton(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    if (themeText) {
        if (theme === 'dark') {
            themeText.textContent = 'Light';
        } else {
            themeText.textContent = 'Dark';
        }
    }
}

/**
 * Load saved theme from localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

// ============================================
// CLIPBOARD OPERATIONS
// ============================================

/**
 * Copy text to clipboard and show notification
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast(`✅ Copiado: <strong>${text}</strong>`);
            trackCopy(text); // Analytics
        })
        .catch(err => {
            console.error('Erro ao copiar:', err);
            showToast('❌ Erro ao copiar', 'error');

            // Fallback for older browsers
            fallbackCopyToClipboard(text);
        });
}

/**
 * Fallback method for copying to clipboard
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast(`✅ Copiado: <strong>${text}</strong>`);
        }
    } catch (err) {
        console.error('Fallback: Erro ao copiar', err);
    }

    document.body.removeChild(textArea);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// SEARCH & FILTER
// ============================================

/**
 * Filter table rows based on search value
 */
function filterTable(tableId, searchValue) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.getElementsByTagName('tbody')[0];
    if (!tbody) return;

    const rows = tbody.getElementsByTagName('tr');
    const search = searchValue.toLowerCase().trim();
    let visibleCount = 0;

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        const isVisible = text.includes(search);
        row.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
    }

    // Show no results message if needed
    showNoResults(tableId, visibleCount === 0, search);
}

/**
 * Filter emoji cards based on search value
 */
function filterEmojis(searchValue) {
    const grid = document.getElementById('emojiGrid');
    if (!grid) return;

    const cards = grid.getElementsByClassName('emoji-card');
    const search = searchValue.toLowerCase().trim();
    let visibleCount = 0;

    for (let card of cards) {
        const text = card.textContent.toLowerCase();
        const isVisible = text.includes(search);
        card.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
    }

    // Show no results message if needed
    showNoResults('emojiGrid', visibleCount === 0, search);
}

/**
 * Show or hide "no results" message
 */
function showNoResults(containerId, show, searchTerm) {
    const existingMessage = document.getElementById(`no-results-${containerId}`);

    if (show && !existingMessage) {
        const container = document.getElementById(containerId);
        const message = document.createElement('div');
        message.id = `no-results-${containerId}`;
        message.className = 'no-results';
        message.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">
                Nenhum resultado encontrado para "<strong>${searchTerm}</strong>"
            </div>
        `;
        container.parentElement.appendChild(message);
    } else if (!show && existingMessage) {
        existingMessage.remove();
    }
}

// ============================================
// SCROLL FUNCTIONALITY
// ============================================

/**
 * Scroll to top of page smoothly
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Handle scroll events for back-to-top button
 */
function handleScroll() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K: Focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('searchCommits');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape: Clear search
    if (event.key === 'Escape') {
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.value = '';
            input.dispatchEvent(new Event('input'));
        });
    }

    // Ctrl/Cmd + /: Toggle theme
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        toggleTheme();
    }
}

// ============================================
// ANALYTICS (OPTIONAL)
// ============================================

/**
 * Track emoji copy events
 */
function trackCopy(emoji) {
    // Add your analytics tracking here
    console.log('Emoji copiado:', emoji);

    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'copy_emoji', {
    //         'emoji_code': emoji
    //     });
    // }
}

/**
 * Track page views
 */
function trackPageView() {
    console.log('Página carregada');

    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('config', 'GA_MEASUREMENT_ID');
    // }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get emoji statistics
 */
function getEmojiStats() {
    const commitsTable = document.getElementById('commitsTable');
    const emojiGrid = document.getElementById('emojiGrid');

    const commitsCount = commitsTable ?
        commitsTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr').length : 0;

    const emojisCount = emojiGrid ?
        emojiGrid.getElementsByClassName('emoji-card').length : 0;

    return {
        commits: commitsCount,
        emojis: emojisCount,
        total: commitsCount + emojisCount
    };
}

/**
 * Display statistics
 */
function displayStats() {
    const stats = getEmojiStats();
    console.log('Estatísticas:', stats);

    // You can display this in the UI if needed
    // const statsContainer = document.getElementById('stats');
    // if (statsContainer) {
    //     statsContainer.innerHTML = `
    //         <p>Total de emojis: ${stats.total}</p>
    //         <p>Commits: ${stats.commits}</p>
    //         <p>Outros: ${stats.emojis}</p>
    //     `;
    // }
}

// ============================================
// LAZY LOADING (OPTIONAL)
// ============================================

/**
 * Lazy load images or content
 */
function lazyLoad() {
    const lazyElements = document.querySelectorAll('[data-lazy]');

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });

    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// ============================================
// FAVORITES (LOCAL STORAGE)
// ============================================

/**
 * Add emoji to favorites
 */
function addToFavorites(emoji) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (!favorites.includes(emoji)) {
        favorites.push(emoji);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showToast(`⭐ ${emoji} adicionado aos favoritos`);
    } else {
        showToast(`${emoji} já está nos favoritos`, 'info');
    }
}

/**
 * Remove emoji from favorites
 */
function removeFromFavorites(emoji) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(fav => fav !== emoji);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showToast(`${emoji} removido dos favoritos`);
}

/**
 * Get all favorites
 */
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

/**
 * Display favorites section
 */
function displayFavorites() {
    const favorites = getFavorites();
    console.log('Favoritos:', favorites);

    // You can create a favorites section in the UI
    // const favoritesContainer = document.getElementById('favorites');
    // if (favoritesContainer && favorites.length > 0) {
    //     favoritesContainer.innerHTML = favorites.map(emoji => 
    //         `<span class="favorite-emoji">${emoji}</span>`
    //     ).join('');
    // }
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

/**
 * Export emoji list as JSON
 */
function exportAsJSON() {
    const stats = getEmojiStats();
    const data = {
        exportDate: new Date().toISOString(),
        stats: stats,
        favorites: getFavorites()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emojis-git.json';
    a.click();
    URL.revokeObjectURL(url);

    showToast('📥 Arquivo JSON exportado com sucesso!');
}

/**
 * Print friendly version
 */
function printPage() {
    window.print();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Load theme
    loadTheme();

    // Track page view
    trackPageView();

    // Display stats
    displayStats();

    // Setup scroll listener with debounce
    window.addEventListener('scroll', debounce(handleScroll, 100));

    // Setup keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Prevent button clicks from triggering parent clicks
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Setup lazy loading
    lazyLoad();

    // Display favorites
    displayFavorites();

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('🎉 Emojis para Git - Inicializado com sucesso!');
}

// ============================================
// EVENT LISTENERS
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('🟢 Conexão restaurada');
});

window.addEventListener('offline', () => {
    showToast('🔴 Você está offline', 'error');
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Página oculta');
    } else {
        console.log('Página visível');
    }
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

window.emojiGit = {
    toggleTheme,
    copyToClipboard,
    filterTable,
    filterEmojis,
    scrollToTop,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    exportAsJSON,
    printPage,
    getEmojiStats
};


// ===========================================
// Markdown Script
// ===========================================
  function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
    // fallback simples
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  function extractShortcodesFromMarkdown(md) {
    // pega :smile:, :+1:, :-1:, etc.
    const re = /:([+\w-]+):/g;
    const found = [];
    const seen = new Set();

    let m;
    while ((m = re.exec(md)) !== null) {
      const code = m[1];
      // evita pegar coisas como :---: se aparecerem em algum lugar
      if (!code || code === "---") continue;

      if (!seen.has(code)) {
        seen.add(code);
        found.push(code);
      }
    }
    return found;
  }

  async function loadGithubEmojiMap() {
    // Mapa { smile: "https://...png", ... }
    const res = await fetch("https://api.github.com/emojis");
    if (!res.ok) throw new Error("Falha ao carregar emojis do GitHub API");
    return res.json();
  }

  function createEmojiCard({ shortcode, imgUrl }) {
    const card = document.createElement("div");
    card.className = "emoji-card";
    card.addEventListener("click", () => copyToClipboard(`:${shortcode}:`));

    const icon = document.createElement("div");
    icon.className = "emoji-icon";

    // usando imagem do GitHub (cobre também :shipit:, :bowtie:, etc.)
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `:${shortcode}:`;
    img.width = 28;
    img.height = 28;
    img.loading = "lazy";
    icon.appendChild(img);

    const info = document.createElement("div");
    info.className = "emoji-info";

    const codeDiv = document.createElement("div");
    codeDiv.className = "emoji-code";
    codeDiv.textContent = `:${shortcode}:`;

    info.appendChild(codeDiv);

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "📋";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      copyToClipboard(`:${shortcode}:`);
    });

    card.appendChild(icon);
    card.appendChild(info);
    card.appendChild(btn);

    return card;
  }

  async function renderEmojiGridFromMarkdown(md, gridEl) {
    const shortcodes = extractShortcodesFromMarkdown(md);
    const emojiMap = await loadGithubEmojiMap();

    const frag = document.createDocumentFragment();

    for (const sc of shortcodes) {
      const imgUrl = emojiMap[sc];
      if (!imgUrl) {
        // shortcode não encontrado no mapa do GitHub (raro)
        continue;
      }
      frag.appendChild(createEmojiCard({ shortcode: sc, imgUrl }));
    }

    gridEl.innerHTML = "";
    gridEl.appendChild(frag);
  }

  // ---- Inicialização ----
  document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("emojiGrid");

    // Opção A: lê de <script type="text/plain" id="emojiMarkdown">
    const mdEl = document.getElementById("emojiMarkdown");
    const md = mdEl ? mdEl.textContent : "";

    // Se você preferir, pode também setar md = `...` direto no JS
    await renderEmojiGridFromMarkdown(md, grid);
  });
