import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  da: {
    translation: {
      // Auth
      login_tagline: 'Din personlige hukommelsestræner',
      email: 'E-mail',
      password: 'Adgangskode',
      confirm_password: 'Bekræft adgangskode',
      name: 'Navn',
      login: 'Log ind',
      signup: 'Opret konto',
      or: 'eller',
      continue_google: 'Fortsæt med Google',
      no_account: 'Har du ikke en konto?',
      has_account: 'Har du allerede en konto?',

      // Navigation
      nav_home: 'Hjem',
      nav_names: 'Navne',
      nav_peg: 'PEG',
      nav_notes: 'Noter',

      // Dashboard
      welcome: 'Velkommen tilbage',
      welcome_sub: 'Hvad vil du træne i dag?',
      names_title: 'Navneliste',
      names_desc: 'Husk navne med visuelle huskregler',
      peg_title: 'Number PEG',
      peg_desc: '00-99 tal-associations-system',
      notes_title: 'Noter',
      notes_desc: 'Gem dine hukommelsesteknikker',
      progress: 'Din fremgang',
      names_memorized: 'Navne husket',
      peg_progress: 'PEG-liste',
      techniques_saved: 'Teknikker gemt',
      filled: 'udfyldt',

      // Names
      search_names: 'Søg i navne...',
      add_name: 'Tilføj navn',
      full_name: 'Fulde navn',
      mnemonic: 'Huskeregel',
      ai_generate: 'Generer visuelt indtryk med AI',
      ai_generate_image: 'Generer billede',
      ai_description_label: 'AI Beskrivelse',
      ai_image_label: 'AI Billede',
      no_names: 'Ingen navne endnu. Tilføj dit første navn!',

      // PEG
      search_peg: 'Søg tal (00-99)...',
      peg_word: 'PEG-ord',
      consonant_code: 'Konsonant-kode',
      add_peg: '+ Tilføj',

      // Notes
      search_notes: 'Søg i noter...',
      new_note: 'Ny note',
      note_title: 'Titel',
      note_content: 'Indhold',
      note_category: 'Kategori',
      no_notes: 'Ingen noter endnu. Opret din første note!',

      // Common
      save: 'Gem',
      cancel: 'Annuller',
      delete: 'Slet',
      edit: 'Rediger',
      close: 'Luk',
      loading: 'Indlæser...',
      error: 'Der opstod en fejl',
      created: 'Oprettet',

      // Settings
      settings: 'Indstillinger',
      profile: 'Profil',
      language: 'Sprog',
      theme: 'Tema',
      export_data: 'Eksporter data',
      logout: 'Log ud',
    },
  },
  en: {
    translation: {
      // Auth
      login_tagline: 'Your personal memory trainer',
      email: 'Email',
      password: 'Password',
      confirm_password: 'Confirm password',
      name: 'Name',
      login: 'Log in',
      signup: 'Create account',
      or: 'or',
      continue_google: 'Continue with Google',
      no_account: "Don't have an account?",
      has_account: 'Already have an account?',

      // Navigation
      nav_home: 'Home',
      nav_names: 'Names',
      nav_peg: 'PEG',
      nav_notes: 'Notes',

      // Dashboard
      welcome: 'Welcome back',
      welcome_sub: 'What do you want to practice today?',
      names_title: 'Name List',
      names_desc: 'Remember names with visual mnemonics',
      peg_title: 'Number PEG',
      peg_desc: '00-99 number association system',
      notes_title: 'Notes',
      notes_desc: 'Save your memory techniques',
      progress: 'Your progress',
      names_memorized: 'Names memorized',
      peg_progress: 'PEG list',
      techniques_saved: 'Techniques saved',
      filled: 'filled',

      // Names
      search_names: 'Search names...',
      add_name: 'Add name',
      full_name: 'Full name',
      mnemonic: 'Mnemonic',
      ai_generate: 'Generate visual impression with AI',
      ai_generate_image: 'Generate image',
      ai_description_label: 'AI Description',
      ai_image_label: 'AI Image',
      no_names: 'No names yet. Add your first name!',

      // PEG
      search_peg: 'Search number (00-99)...',
      peg_word: 'PEG word',
      consonant_code: 'Consonant code',
      add_peg: '+ Add',

      // Notes
      search_notes: 'Search notes...',
      new_note: 'New note',
      note_title: 'Title',
      note_content: 'Content',
      note_category: 'Category',
      no_notes: 'No notes yet. Create your first note!',

      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      error: 'An error occurred',
      created: 'Created',

      // Settings
      settings: 'Settings',
      profile: 'Profile',
      language: 'Language',
      theme: 'Theme',
      export_data: 'Export data',
      logout: 'Log out',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('superbrain-lang') || 'da',
  fallbackLng: 'da',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
