/* ============================================
   VANES APK - Main JavaScript (Step 1)
   ============================================ */

/* 1. DATA APLIKASI
   Tambah APK baru dengan menyalin satu blok { ... } di bawah. */

const apps = [
    {
        id: 1,
        name: "INS Media",
        version: "32",
        size: "7.51 MB",
        category: "Tools",
        description: "Aplikasi tools INS Media untuk Android.",
        icon: "assets/INS_MEDIA.jpg",

        // GANTI LINK DOWNLOAD APK DI SINI
        downloadUrl: "https://www.mediafire.com/file/cv9h2tdbq6lc85w/INS-Media.apk/file",

        updatedAt: "14 Oktober 2026",
        changelog: "Rilis pertama."
    }
];



/* 2. ELEMEN HTML */

const totalApps = document.getElementById("total-apps");
const appsGrid = document.getElementById("apps-grid");
const searchInput = document.getElementById("search-input");
const categoryList = document.getElementById("category-list");
const emptyState = document.getElementById("empty-state");
const currentYear = document.getElementById("current-year");

let activeCategory = "Semua";

if (currentYear) currentYear.textContent = new Date().getFullYear();


/* 3. UTILITAS */

function escapeHTML(value) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(value ?? "").replace(/[&<>"']/g, (c) => entities[c]);
}

function isValidDownloadUrl(value) {
    if (typeof value !== "string" || !value.trim()) return false;
    if (value.includes("GANTI_LINK_DOWNLOAD")) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

function iconMarkup(app, fallbackClass) {
    const initial = escapeHTML((app.name || "A").trim().charAt(0).toUpperCase() || "A");
    if (!app.icon) return `<span class="${fallbackClass}">${initial}</span>`;
    return `
        <img src="${escapeHTML(app.icon)}" alt="Ikon ${escapeHTML(app.name)}"
             onerror="this.style.display='none';this.nextElementSibling.hidden=false;">
        <span class="${fallbackClass}" hidden>${initial}</span>
    `;
}

function downloadMarkup(app, className) {
    if (!isValidDownloadUrl(app.downloadUrl)) {
        return `<button class="${className}" type="button" disabled>Link belum tersedia</button>`;
    }
    return `
        <a class="${className}" href="${escapeHTML(app.downloadUrl)}"
           target="_blank" rel="noopener noreferrer"
           aria-label="Download ${escapeHTML(app.name)} versi ${escapeHTML(app.version)}">
            Download APK
        </a>
    `;
}


/* 4. KARTU APLIKASI */

function createAppCard(app) {
    const updated = app.updatedAt ? `<span>Update ${escapeHTML(app.updatedAt)}</span>` : "";
    const changelog = app.changelog
        ? `<details class="app-changelog"><summary>Catatan pembaruan</summary><p>${escapeHTML(app.changelog)}</p></details>`
        : "";

    return `
        <article class="app-card">
            <div class="app-card-top">
                <div class="app-icon">${iconMarkup(app, "app-icon-fallback")}</div>
                <div class="app-heading">
                    <h3>${escapeHTML(app.name)}</h3>
                    <span class="app-category">${escapeHTML(app.category || "Lainnya")}</span>
                </div>
            </div>
            <p class="app-description">${escapeHTML(app.description || "Belum ada deskripsi.")}</p>
            <div class="app-meta">
                <span>Versi ${escapeHTML(app.version || "-")}</span>
                <span>${escapeHTML(app.size || "-")}</span>
                ${updated}
            </div>
            ${changelog}
            ${downloadMarkup(app, "app-download")}
        </article>
    `;
}


/* 5. KATEGORI (hanya yang ada isinya) */

function renderCategories() {
    if (!categoryList) return;

    const categories = ["Semua", ...new Set(apps.map((app) => app.category || "Lainnya"))];

    categoryList.innerHTML = categories
        .map((name) => {
            const active = name === activeCategory;
            return `<button type="button" class="category-button${active ? " active" : ""}"
                data-category="${escapeHTML(name)}" aria-pressed="${active}">${escapeHTML(name)}</button>`;
        })
        .join("");
}


/* 6. DAFTAR APLIKASI + PENCARIAN */

function renderCatalog() {
    if (!appsGrid) return;

    const keyword = searchInput ? searchInput.value.trim().toLocaleLowerCase("id") : "";

    const filtered = apps.filter((app) => {
        const text = [app.name, app.description, app.category, app.version]
            .join(" ")
            .toLocaleLowerCase("id");
        const matchCategory =
            activeCategory === "Semua" || (app.category || "Lainnya") === activeCategory;
        return text.includes(keyword) && matchCategory;
    });

    appsGrid.innerHTML = filtered.map(createAppCard).join("");
    if (emptyState) emptyState.hidden = filtered.length > 0;
}

if (searchInput) searchInput.addEventListener("input", renderCatalog);

if (categoryList) {
    categoryList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-category]");
        if (!button) return;

        activeCategory = button.dataset.category || "Semua";
        renderCategories();
        renderCatalog();
    });
}

if (totalApps) totalApps.textContent = apps.length;

renderCategories();
renderCatalog();


/* 7. MENU GARIS TIGA */

const menuButton = document.getElementById("menu-button");
const menuPanel = document.getElementById("menu-panel");

function setMenu(open) {
    if (!menuButton || !menuPanel) return;
    menuPanel.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
}

if (menuButton && menuPanel) {
    menuButton.addEventListener("click", () => setMenu(menuPanel.hidden));

    menuPanel.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", (event) => {
        if (!menuPanel.hidden && !event.target.closest(".header")) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !menuPanel.hidden) {
            setMenu(false);
            menuButton.focus();
        }
    });
}


/* 8. PINDAH HALAMAN (Home / INS_AGENCY) */

const pageHome = document.getElementById("page-home");
const pageAgency = document.getElementById("page-agency");

function showPage() {
    const isAgency = window.location.hash === "#agency";

    if (pageHome) pageHome.hidden = isAgency;
    if (pageAgency) pageAgency.hidden = !isAgency;

    document.querySelectorAll("[data-page]").forEach((link) => {
        const active = link.dataset.page === (isAgency ? "agency" : "home");
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    document.title = isAgency
        ? "INS_AGENCY - Vanes APK"
        : "Vanes APK - INS Media";

    if (isAgency) window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showPage);
showPage();


/* 9. SALIN SEMUA TEKS */

const promptSource = document.getElementById("prompt-source");
const promptBox = document.getElementById("prompt-box");
const copyAll = document.getElementById("copy-all");
const copyStatus = document.getElementById("copy-status");

const promptText = promptSource ? promptSource.textContent.trim() : "";

if (promptBox) promptBox.textContent = promptText;

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            /* lanjut ke cara cadangan */
        }
    }

    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    let ok = false;
    try {
        ok = document.execCommand("copy");
    } catch {
        ok = false;
    }

    area.remove();
    return ok;
}

let copyTimer;

if (copyAll) {
    copyAll.addEventListener("click", async () => {
        const ok = await copyText(promptText);

        copyAll.textContent = ok ? "Tersalin" : "Gagal menyalin";
        if (copyStatus) {
            copyStatus.textContent = ok
                ? "Seluruh teks sudah disalin."
                : "Salin manual: tekan lama teks lalu pilih Salin.";
        }

        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
            copyAll.textContent = "Salin semua";
            if (copyStatus) copyStatus.textContent = "";
        }, 2500);
    });
}
