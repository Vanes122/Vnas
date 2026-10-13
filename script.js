
/* ============================================
   VANES APK
   Main JavaScript
   ============================================ */


/* ============================================
   1. DATA APLIKASI
   Saat ini hanya ada 1 APK.
   ============================================ */

const apps = [
    {
        id: 1,
        name: "INS_MEDIA",
        version: "32",
        size: "7.51 MB",
        category: "Tools",
        description: "INS_MEDIA_TOLLS",
        icon: "assets/INS_MEDIA.jpg",

        // GANTI LINK DOWNLOAD APK DI SINI
        downloadUrl: "https://www.mediafire.com/file/cv9h2tdbq6lc85w/INS-Media.apk/file",

        updatedAt: "14 Oktober 2026",
        changelog: "FIRST"
    }
];


/* ============================================
   2. AMBIL ELEMEN HTML
   ============================================ */

const appsGrid = document.getElementById("apps-grid");
const searchInput = document.getElementById("search-input");
const categoryList = document.getElementById("category-list");
const emptyState = document.getElementById("empty-state");
const totalApps = document.getElementById("total-apps");
const currentYear = document.getElementById("current-year");

let activeCategory = "Semua";


/* ============================================
   3. INFORMASI WEBSITE
   ============================================ */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (totalApps) {
    totalApps.textContent = apps.length;
}


/* ============================================
   4. AMANKAN TEKS HTML
   ============================================ */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];
    });
}


/* ============================================
   5. VALIDASI LINK DOWNLOAD
   ============================================ */

function isValidDownloadUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    if (value.includes("GANTI_LINK_DOWNLOAD")) {
        return false;
    }

    try {
        const url = new URL(value);

        return (
            url.protocol === "https:" ||
            url.protocol === "http:"
        );
    } catch {
        return false;
    }
}


/* ============================================
   6. FORMAT UKURAN FILE
   ============================================ */

function formatFileSize(size) {
    if (typeof size === "number" && Number.isFinite(size)) {
        if (size < 1024 * 1024) {
            return `${Math.round(size / 1024)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return String(size || "Ukuran tidak diketahui");
}


/* ============================================
   7. IKON APLIKASI
   ============================================ */

function createAppIcon(app) {
    const name = escapeHTML(app.name || "Aplikasi");
    const initial = escapeHTML(
        (app.name || "A").trim().charAt(0).toUpperCase() || "A"
    );

    if (!app.icon) {
        return `<span class="app-icon-fallback">${initial}</span>`;
    }

    return `
        <img
            src="${escapeHTML(app.icon)}"
            alt="Ikon ${name}"
            loading="lazy"
            onerror="
                this.style.display='none';
                this.nextElementSibling.hidden=false;
            "
        >
        <span class="app-icon-fallback" hidden>${initial}</span>
    `;
}


/* ============================================
   8. TOMBOL DOWNLOAD
   ============================================ */

function createDownloadButton(app) {
    const name = escapeHTML(app.name || "Aplikasi");

    if (!isValidDownloadUrl(app.downloadUrl)) {
        return `
            <button
                class="app-download"
                type="button"
                disabled
                title="Masukkan link download APK terlebih dahulu"
            >
                Link belum tersedia
            </button>
        `;
    }

    return `
        <a
            class="app-download"
            href="${escapeHTML(app.downloadUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download ${name}"
        >
            <span aria-hidden="true">↓</span>
            Download APK
        </a>
    `;
}


/* ============================================
   9. KARTU APLIKASI
   ============================================ */

function createAppCard(app) {
    const name = escapeHTML(app.name || "Aplikasi tanpa nama");
    const version = escapeHTML(app.version || "-");
    const size = escapeHTML(formatFileSize(app.size));
    const category = escapeHTML(app.category || "Lainnya");

    const description = escapeHTML(
        app.description || "Belum ada deskripsi aplikasi."
    );

    const updatedAt = app.updatedAt
        ? `<span>Update: ${escapeHTML(app.updatedAt)}</span>`
        : "";

    const changelog = app.changelog
        ? `
            <details class="app-changelog">
                <summary>Catatan pembaruan</summary>
                <p>${escapeHTML(app.changelog)}</p>
            </details>
        `
        : "";

    return `
        <article class="app-card" data-app-id="${escapeHTML(app.id)}">

            <div class="app-card-top">

                <div class="app-icon">
                    ${createAppIcon(app)}
                </div>

                <div class="app-heading">
                    <h3>${name}</h3>
                    <span class="app-category">${category}</span>
                </div>

            </div>

            <p class="app-description">${description}</p>

            <div class="app-meta">
                <span>Versi ${version}</span>
                <span>${size}</span>
                ${updatedAt}
            </div>

            ${changelog}

            ${createDownloadButton(app)}

        </article>
    `;
}


/* ============================================
   10. RENDER APLIKASI DAN PENCARIAN
   ============================================ */

function renderApps() {
    if (!appsGrid) {
        console.error("Elemen #apps-grid tidak ditemukan.");
        return;
    }

    const keyword = searchInput
        ? searchInput.value.trim().toLocaleLowerCase("id")
        : "";

    const filteredApps = apps.filter((app) => {
        const searchableText = [
            app.name,
            app.description,
            app.category,
            app.version
        ]
            .join(" ")
            .toLocaleLowerCase("id");

        const matchesSearch = searchableText.includes(keyword);

        const matchesCategory =
            activeCategory === "Semua" ||
            (app.category || "Lainnya") === activeCategory;

        return matchesSearch && matchesCategory;
    });

    appsGrid.innerHTML = filteredApps
        .map(createAppCard)
        .join("");

    if (emptyState) {
        emptyState.hidden = filteredApps.length > 0;
    }

    if (totalApps) {
        totalApps.textContent = apps.length;
    }
}


/* ============================================
   11. PENCARIAN
   ============================================ */

if (searchInput) {
    searchInput.addEventListener("input", renderApps);
}


/* ============================================
   12. FILTER KATEGORI
   ============================================ */

if (categoryList) {
    categoryList
        .querySelectorAll("[data-category]")
        .forEach((button) => {
            const isActive =
                button.dataset.category === activeCategory;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

    categoryList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-category]");

        if (!button) {
            return;
        }

        activeCategory = button.dataset.category || "Semua";

        categoryList
            .querySelectorAll("[data-category]")
            .forEach((item) => {
                const isActive = item === button;

                item.classList.toggle("active", isActive);

                item.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

        renderApps();
    });
}


/* ============================================
   13. JALANKAN WEBSITE
   ============================================ */

renderApps();

console.log("Vanes APK berhasil dijalankan.");
console.log("Jumlah aplikasi:", apps.length);
