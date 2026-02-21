// ==================== NAVIGATION ====================
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    // Update bottom nav active state
    const navMap = {
        'screen-dashboard': 0,
        'screen-names': 1,
        'screen-peg': 2,
        'screen-notes': 3
    };

    const screen = document.getElementById(screenId);
    const navItems = screen.querySelectorAll('.nav-item');
    navItems.forEach((item, i) => {
        item.classList.toggle('active', i === navMap[screenId]);
    });
}

// ==================== MODAL MANAGEMENT ====================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ==================== AUTH TOGGLE ====================
function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('signup-form').classList.toggle('hidden');
}

// ==================== SEARCH / FILTER ====================
function filterNames() {
    const query = document.getElementById('name-search').value.toLowerCase();
    const cards = document.querySelectorAll('#names-list .name-card');
    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const mnemonic = card.querySelector('.mnemonic-preview').textContent.toLowerCase();
        card.style.display = (name.includes(query) || mnemonic.includes(query)) ? 'flex' : 'none';
    });
}

// ==================== AI SIMULATION ====================
function simulateAI() {
    const result = document.getElementById('ai-result');
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==================== i18n (INTERNATIONALIZATION) ====================
const translations = {
    da: {
        login_tagline: 'Din personlige hukommelsestræner',
        email: 'E-mail',
        password: 'Adgangskode',
        confirm_password: 'Bekræft adgangskode',
        name: 'Navn',
        login_btn: 'Log ind',
        signup_btn: 'Opret konto',
        or: 'eller',
        login_google: 'Fortsæt med Google',
        no_account: 'Har du ikke en konto?',
        signup_link: 'Opret konto',
        has_account: 'Har du allerede en konto?',
        login_link: 'Log ind',
        welcome: 'Velkommen tilbage, Dennis 👋',
        welcome_sub: 'Hvad vil du træne i dag?',
        names_title: 'Navneliste',
        names_desc: 'Husk navne med visuelle huskregler',
        names_count: 'navne',
        peg_title: 'Number PEG',
        peg_desc: '00-99 tal-associations-system',
        peg_count: 'udfyldt',
        notes_title: 'Noter',
        notes_desc: 'Gem dine hukommelsesteknikker',
        notes_count: 'noter',
        stats_title: 'Din fremgang',
        stat_names: 'Navne husket',
        stat_peg: 'PEG-liste',
        stat_notes: 'Teknikker gemt',
        nav_home: 'Hjem',
        nav_names: 'Navne',
        nav_peg: 'PEG',
        nav_notes: 'Noter',
        search_names: 'Søg i navne...',
        search_number: 'Søg tal (00-99)...',
        search_notes: 'Søg i noter...',
        add_name: 'Tilføj navn',
        full_name: 'Fulde navn',
        mnemonic: 'Huskeregel',
        ai_generate: 'Generer visuelt indtryk med AI',
        ai_gen_image: '🎨 Generer billede',
        ai_image_preview: 'AI-genereret billede vises her',
        ai_description: 'AI Beskrivelse',
        ai_image: 'AI Billede',
        cancel: 'Annuller',
        save: 'Gem',
        delete: 'Slet',
        edit: 'Rediger',
        created: 'Oprettet',
        peg_word: 'PEG-ord',
        consonant_code: 'Konsonant-kode',
        peg_add: '+ Tilføj',
        add_note: 'Ny note',
        note_category: 'Kategori',
        note_title_label: 'Titel',
        note_content: 'Indhold',
        settings: 'Indstillinger',
        settings_profile: 'Profil',
        settings_app: 'App',
        settings_data: 'Data',
        language: 'Sprog',
        theme: 'Tema',
        export_data: 'Eksporter data',
        logout: 'Log ud'
    },
    en: {
        login_tagline: 'Your personal memory trainer',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm password',
        name: 'Name',
        login_btn: 'Log in',
        signup_btn: 'Create account',
        or: 'or',
        login_google: 'Continue with Google',
        no_account: "Don't have an account?",
        signup_link: 'Sign up',
        has_account: 'Already have an account?',
        login_link: 'Log in',
        welcome: 'Welcome back, Dennis 👋',
        welcome_sub: 'What do you want to practice today?',
        names_title: 'Name List',
        names_desc: 'Remember names with visual mnemonics',
        names_count: 'names',
        peg_title: 'Number PEG',
        peg_desc: '00-99 number association system',
        peg_count: 'filled',
        notes_title: 'Notes',
        notes_desc: 'Save your memory techniques',
        notes_count: 'notes',
        stats_title: 'Your progress',
        stat_names: 'Names memorized',
        stat_peg: 'PEG list',
        stat_notes: 'Techniques saved',
        nav_home: 'Home',
        nav_names: 'Names',
        nav_peg: 'PEG',
        nav_notes: 'Notes',
        search_names: 'Search names...',
        search_number: 'Search number (00-99)...',
        search_notes: 'Search notes...',
        add_name: 'Add name',
        full_name: 'Full name',
        mnemonic: 'Mnemonic',
        ai_generate: 'Generate visual impression with AI',
        ai_gen_image: '🎨 Generate image',
        ai_image_preview: 'AI-generated image appears here',
        ai_description: 'AI Description',
        ai_image: 'AI Image',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        created: 'Created',
        peg_word: 'PEG word',
        consonant_code: 'Consonant code',
        peg_add: '+ Add',
        add_note: 'New note',
        note_category: 'Category',
        note_title_label: 'Title',
        note_content: 'Content',
        settings: 'Settings',
        settings_profile: 'Profile',
        settings_app: 'App',
        settings_data: 'Data',
        language: 'Language',
        theme: 'Theme',
        export_data: 'Export data',
        logout: 'Log out'
    }
};

let currentLang = 'da';

function setLang(lang) {
    currentLang = lang;

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === lang.toUpperCase());
    });

    // Update lang indicator
    document.querySelectorAll('.lang-indicator').forEach(el => {
        el.textContent = lang.toUpperCase();
    });

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Handle elements with child links
            if (el.querySelector('a')) {
                return; // Skip complex elements
            }
            el.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

// ==================== KEYBOARD SUPPORT ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    }
});
