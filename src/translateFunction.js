import axios from 'axios';

// Set language in localStorage (persistent across sessions)
export const setLanguage = (lang) => {
  localStorage.setItem('language', lang);
};

// Get the current language from localStorage (defaults to 'DE')
export const getCurrentLanguage = () => {
  return localStorage.getItem('language') || 'DE'; // Default to German if no language is set
};

// Translation function to fetch translation based on the ID and current language
export const translate = async (translateID) => {
  const currentLanguage = getCurrentLanguage(); // Use the stored language
  try {
    const response = await axios.get(`/api/translate/${translateID}`);
    const translation = response.data;

    // Return the translation for the current language
    if (currentLanguage === 'DE') {
      return translation.DE || ''; // Fallback to empty string if no translation is found
    } else if (currentLanguage === 'EN') {
      return translation.EN || '';
    } else if (currentLanguage === 'FR') {
      return translation.FR || '';
    }
  } catch (error) {
    console.error('Error fetching translation:', error);
    return ''; // Fallback to empty string in case of an error
  }
};
