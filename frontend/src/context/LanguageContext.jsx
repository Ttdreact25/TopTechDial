import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    heroTitle_1: 'Search across',
    heroTitle_2: '"5.9 Crore+"',
    heroTitle_3: 'Products & Services',
    searchCityPlaceholder: 'Mumbai',
    searchQueryPlaceholder: 'Search for Real Estate Agents...',
    freeListing: 'Free Listing',
    businessBadge: 'BUSINESS',
    login: 'Login',
    logout: 'Logout',
    categories: 'Popular Categories',
    viewAll: 'View All',
    en: 'EN',
    ta: 'TA'
  },
  ta: {
    heroTitle_1: 'தேடுங்கள்',
    heroTitle_2: '"5.9 கோடி+"',
    heroTitle_3: 'தயாரிப்புகள் மற்றும் சேவைகள்',
    searchCityPlaceholder: 'மும்பை',
    searchQueryPlaceholder: 'ரியல் எஸ்டேட் ஏஜென்ட்களைத் தேடுங்கள்...',
    freeListing: 'இலவச பட்டியல்',
    businessBadge: 'வணிகம்',
    login: 'உள்நுழைய',
    logout: 'வெளியேறு',
    categories: 'பிரபலமான வகைகள்',
    viewAll: 'அனைத்தையும் பார்',
    en: 'EN',
    ta: 'TA'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const switchLanguage = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
