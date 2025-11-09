// Shared language and theme controller for all pages
(function(){
  const langStorageKey = 'lang';
  const themeStorageKey = 'theme';
  // Central toggle to enable/disable opening external map links
  const MAPS_ENABLED = false;

  let lang = localStorage.getItem(langStorageKey) || 'ar';
  let theme = localStorage.getItem(themeStorageKey) || 'light';

  function setLangToggleLabel(){
    const langBtn = document.getElementById('langBtn');
    if(langBtn){ langBtn.textContent = lang === 'ar' ? 'EN' : 'ع'; }
  }

  function applyTheme(){
    const themeBtn = document.getElementById('themeBtn');
    const isDark = theme === 'dark';
    document.documentElement.style.setProperty('--primary', isDark ? '#0b3b6f' : '#1f5fbf');
    document.body.style.background = isDark ? '#0f1724' : '#fafafa';
    // try to darken common card containers
    document.querySelectorAll('.card, .info-section').forEach(x => {
      x.style.background = isDark ? '#0b1220' : '';
      x.style.color = isDark ? '#e6e6e6' : '';
    });
    // Update theme button icon
    if(themeBtn){ themeBtn.textContent = isDark ? '☀️' : '🌙'; }
  }

  const dict = {
    index: {
      // index has its own logic; we only set toggle label here
    },
    buildings: {
      pageTitle: { ar: 'المباني', en: 'Buildings' },
      searchPlaceholder: { ar: '...البحث عن المباني، المعامل، الخدمات', en: 'Search buildings, labs, services...' }
    },
    services: {
      pageTitle: { ar: 'الخدمات', en: 'Services' },
      searchPlaceholder: { ar: '...البحث عن المباني، المعامل، الخدمات', en: 'Search buildings, labs, services...' }
    },
    lectureHalls: {
      pageTitle: { ar: 'قاعات المحاضرات', en: 'Lecture Halls' },
      searchPlaceholder: { ar: '...البحث عن المباني، المعامل، الخدمات', en: 'Search buildings, labs, services...' }
    },
    discover: {
      pageTitle: { ar: 'اكتشف', en: 'Discover' },
      searchPlaceholder: { ar: 'البحث عن المباني، المعامل، الخدمات...', en: 'Search buildings, labs, services...' }
    },
    labs: {
      pageTitle: { ar: 'المعامل', en: 'Labs' },
      searchPlaceholder: { ar: '...البحث عن المباني، المعامل، الخدمات', en: 'Search buildings, labs, services...' }
    },
    employeeOffices: {
      pageTitle: { ar: 'مكاتب الموظفين', en: 'Employee Offices' },
      searchPlaceholder: { ar: '...البحث عن المباني، المعامل، الخدمات', en: 'Search buildings, labs, services...' }
    },
    recreationAreas: {
      pageTitle: { ar: 'مناطق الترفيه', en: 'Recreation Areas' },
      searchPlaceholder: { ar: '...البحث عن المباني، المعامل، الخدمات', en: 'Search buildings, labs, services...' }
    },
    buildingDetails: {
      aboutTitle: { ar: 'عن هذا المكان', en: 'About this place' },
      locTitle: { ar: 'الموقع', en: 'Location' },
      openMapBtn: { ar: 'افتح الموقع في الخريطة', en: 'Open location in map' }
    },
    buildingCs: {
      buildingTitle: { ar: 'مبنى علوم الحاسب', en: 'Computer Science Building' },
      aboutTitle: { ar: 'عن هذا المكان', en: 'About this place' },
      locTitle: { ar: 'الموقع', en: 'Location' },
      openMapBtn: { ar: 'افتح الموقع في الخريطة', en: 'Open location in map' },
      aboutDesc: {
        ar: 'يضم معامل البرمجة وقاعات المحاضرات الخاصة بقسم علوم الحاسب ومكاتب الأساتذة والمعامل الذكية.',
        en: 'Includes programming labs, CS lecture halls, faculty offices, and smart labs.'
      },
      locDesc: {
        ar: 'المنطقة الأكاديمية - المنطقة C بجوار مبنى الهندسة',
        en: 'Academic zone - Area C next to the Engineering building'
      }
    },
    playgroundDetails: {
      buildingTitle: { ar: 'الملعب', en: 'Playground' },
      aboutTitle: { ar: 'عن هذا المكان', en: 'About this place' },
      locTitle: { ar: 'الموقع', en: 'Location' },
      openMapBtn: { ar: 'افتح الموقع في الخريطة', en: 'Open location in map' },
      buildingDescription: {
        ar: 'يُستخدم هذا الملعب لإقامة الأنشطة الرياضية والمباريات الطلابية وفعاليات الجامعة',
        en: 'This playground hosts sports activities, student matches, and university events'
      },
      buildingLocation: {
        ar: 'المنطقة الرياضية - جنوب الجامعة',
        en: 'Sports area - South of campus'
      }
    }
  };

  function applyLang(){
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setLangToggleLabel();
    const page = document.body.dataset.page || 'index';
    const d = dict[page] || {};

    // Common title
    if(d.pageTitle && document.getElementById('pageTitle')){
      document.getElementById('pageTitle').textContent = d.pageTitle[lang];
    }
    // Common search
    if(d.searchPlaceholder && document.getElementById('searchInput')){
      document.getElementById('searchInput').placeholder = d.searchPlaceholder[lang];
    }

    // Page-specific text blocks
    if(page === 'buildingDetails'){
      const aboutTitle = document.getElementById('aboutTitle');
      const locTitle = document.getElementById('locTitle');
      const openMapBtn = document.getElementById('openMapBtn');
      aboutTitle && (aboutTitle.textContent = d.aboutTitle[lang]);
      locTitle && (locTitle.textContent = d.locTitle[lang]);
      openMapBtn && (openMapBtn.textContent = d.openMapBtn[lang]);
      const data = window.currentBuildingData;
      if(data){
        const titleEl = document.getElementById('buildingTitle');
        const descEl = document.getElementById('buildingDescription');
        const locEl = document.getElementById('buildingLocation');
        titleEl && (titleEl.textContent = lang==='ar' ? data.title_ar : data.title_en);
        descEl && (descEl.textContent = lang==='ar' ? data.description_ar : data.description_en);
        locEl && (locEl.textContent = lang==='ar' ? data.location_ar : data.location_en);
      }
    }

    if(page === 'buildingCs'){
      const m = dict.buildingCs;
      const titleEl = document.getElementById('buildingTitle');
      const aboutTitle = document.getElementById('aboutTitle');
      const locTitle = document.getElementById('locTitle');
      const openMapBtn = document.getElementById('openMapBtn');
      const aboutDesc = document.getElementById('aboutDesc');
      const locDesc = document.getElementById('locDesc');
      titleEl && (titleEl.textContent = m.buildingTitle[lang]);
      aboutTitle && (aboutTitle.textContent = m.aboutTitle[lang]);
      locTitle && (locTitle.textContent = m.locTitle[lang]);
      openMapBtn && (openMapBtn.textContent = m.openMapBtn[lang]);
      aboutDesc && (aboutDesc.textContent = m.aboutDesc[lang]);
      locDesc && (locDesc.textContent = m.locDesc[lang]);
    }

    if(page === 'playgroundDetails'){
      const m = dict.playgroundDetails;
      const titleEl = document.getElementById('buildingTitle');
      const openMapBtn = document.getElementById('openMapBtn');
      const aboutTitleEls = document.querySelectorAll('.section-title');
      // Assume first section-title is about, second is location
      if(aboutTitleEls[0]) aboutTitleEls[0].textContent = m.aboutTitle[lang];
      if(aboutTitleEls[1]) aboutTitleEls[1].textContent = m.locTitle[lang];
      titleEl && (titleEl.textContent = m.buildingTitle[lang]);
      openMapBtn && (openMapBtn.textContent = m.openMapBtn[lang]);
      const descEl = document.getElementById('buildingDescription');
      const locEl = document.getElementById('buildingLocation');
      descEl && (descEl.textContent = m.buildingDescription[lang]);
      locEl && (locEl.textContent = m.buildingLocation[lang]);
    }
  }

  function init(){
    applyTheme();
    applyLang();
    const page = document.body.dataset.page || 'index';
    const langBtn = document.getElementById('langBtn');
    const themeBtn = document.getElementById('themeBtn');
    // Avoid double-binding on index; index has its own handlers
    if(page !== 'index'){
      langBtn && langBtn.addEventListener('click', ()=>{
        lang = lang === 'ar' ? 'en' : 'ar';
        localStorage.setItem(langStorageKey, lang);
        applyLang();
      });
      themeBtn && themeBtn.addEventListener('click', ()=>{
        theme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem(themeStorageKey, theme);
        applyTheme();
      });
    }

    // Sync across tabs/windows: react to changes from other pages
    window.addEventListener('storage', (e)=>{
      if(e.key === langStorageKey){
        lang = localStorage.getItem(langStorageKey) || 'ar';
        applyLang();
      } else if(e.key === themeStorageKey){
        theme = localStorage.getItem(themeStorageKey) || 'light';
        applyTheme();
      }
    });

    // Global: open location in Google Maps for detail pages
    const openMapBtn = document.getElementById('openMapBtn');
    if(openMapBtn){
      openMapBtn.addEventListener('click', (ev)=>{
        ev.preventDefault();
        if(!MAPS_ENABLED){
          // Do nothing for now – map opening is disabled globally
          return;
        }
        const currentLang = document.documentElement.lang || 'ar';
        let query = '';
        // Prefer structured data if available
        const data = window.currentBuildingData;
        if(data){
          const title = currentLang === 'ar' ? data.title_ar : data.title_en;
          const loc = currentLang === 'ar' ? (data.location_ar || '') : (data.location_en || '');
          query = `${title} ${loc}`.trim();
        } else {
          const titleEl = document.getElementById('buildingTitle');
          const locEl = document.getElementById('buildingLocation');
          const title = titleEl ? titleEl.textContent.trim() : '';
          const loc = locEl ? locEl.textContent.trim() : '';
          query = `${title} ${loc}`.trim();
        }
        if(!query){ query = currentLang === 'ar' ? 'أكاديمية طيبة' : 'Tiba Academy'; }
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
      }, { once: false });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();