import { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/appStore';
import { Accessibility, Sun, Moon, Type, Eye, Volume2 } from 'lucide-react';

export function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const cleanText = text.trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'uz-UZ';
  
  const voices = window.speechSynthesis.getVoices();
  const uzVoice = voices.find(v => v.lang.includes('uz') || v.lang.includes('UZ'));
  const ruVoice = voices.find(v => v.lang.includes('ru') || v.lang.includes('RU'));
  
  if (uzVoice) {
    utterance.voice = uzVoice;
  } else if (ruVoice) {
    utterance.voice = ruVoice; // Fallback to Russian voice if Uzbek voice isn't installed
  }
  
  window.speechSynthesis.speak(utterance);
}

export default function AccessibilityWidget() {
  const { theme, toggleTheme, accessibility, updateAccessibility } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // Setup click listener for text to speech
  useEffect(() => {
    if (!accessibility.textToSpeech) return;

    const handleGlobalClick = (e) => {
      // Find readable text from clicked element
      let text = '';
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        text = e.target.placeholder || e.target.value || '';
      } else if (e.target.tagName === 'SELECT') {
        text = e.target.options[e.target.selectedIndex]?.text || '';
      } else {
        text = e.target.innerText || e.target.getAttribute('aria-label') || '';
      }
      
      if (text.length > 0 && text.length < 200) {
        speakText(text);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [accessibility.textToSpeech]);

  // Read current setting change out loud if TTS is active
  const handleToggle = (key, currentVal) => {
    const newVal = !currentVal;
    updateAccessibility(key, newVal);
    
    if (accessibility.textToSpeech || key === 'textToSpeech') {
      const labels = {
        largeText: newVal ? "Matn kattalashtirildi" : "Matn kichiklashtirildi",
        highContrast: newVal ? "Yuqori kontrast yoqildi" : "Yuqori kontrast o'chirildi",
        dyslexicFont: newVal ? "O'qish qulay shrifti faollashdi" : "Standart shrift tiklandi",
        textToSpeech: newVal ? "Ovozli o'quvchi yoqildi" : "Ovozli o'quvchi o'chirildi"
      };
      setTimeout(() => speakText(labels[key] || ""), 100);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    if (accessibility.textToSpeech) {
      setTimeout(() => speakText(theme === 'light' ? "Tungi rejim yoqildi" : "Kunduzgi rejim yoqildi"), 100);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button className="accessibility-fab" onClick={() => setIsOpen(!isOpen)} aria-label="Maxsus imkoniyatlar paneli">
        <Accessibility size={24} />
      </button>

      {/* Settings Menu Popup */}
      {isOpen && (
        <div className="accessibility-menu animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="accessibility-menu-title">
            <Accessibility size={18} color="var(--c-green-600)" />
            <span>Maxsus imkoniyatlar</span>
          </div>

          {/* Theme mode */}
          <div className="accessibility-option">
            <span className="accessibility-option-label flex items-center gap-2">
              {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
              Mavzu ({theme === 'light' ? "Kunduzgi" : "Kechgi"})
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleThemeToggle} style={{ padding: '.25rem .6rem', borderRadius: 8 }}>
              {theme === 'light' ? "Kechgi 🌙" : "Kunduzgi ☀️"}
            </button>
          </div>

          {/* Large text */}
          <div className="accessibility-option">
            <span className="accessibility-option-label flex items-center gap-2">
              <Type size={15} />
              Kattalashtirilgan matn
            </span>
            <label className="toggle-switch">
              <input type="checkbox" checked={accessibility.largeText} onChange={() => handleToggle('largeText', accessibility.largeText)} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* High contrast */}
          <div className="accessibility-option">
            <span className="accessibility-option-label flex items-center gap-2">
              <Eye size={15} />
              Yuqori kontrast
            </span>
            <label className="toggle-switch">
              <input type="checkbox" checked={accessibility.highContrast} onChange={() => handleToggle('highContrast', accessibility.highContrast)} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Dyslexic font */}
          <div className="accessibility-option">
            <span className="accessibility-option-label flex items-center gap-2">
              <Type size={15} style={{ transform: 'skewX(-10deg)' }} />
              O'qishga qulay shrift
            </span>
            <label className="toggle-switch">
              <input type="checkbox" checked={accessibility.dyslexicFont} onChange={() => handleToggle('dyslexicFont', accessibility.dyslexicFont)} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Text to Speech */}
          <div className="accessibility-option">
            <span className="accessibility-option-label flex items-center gap-2">
              <Volume2 size={15} />
              Ovozli yordamchi (TTS)
            </span>
            <label className="toggle-switch">
              <input type="checkbox" checked={accessibility.textToSpeech} onChange={() => handleToggle('textToSpeech', accessibility.textToSpeech)} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      )}
    </>
  );
}
