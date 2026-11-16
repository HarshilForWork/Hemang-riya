/* =========================================================
   Riya + Hemang — interactions, scroll choreography & languages
   Languages: "en" (English), "gu" (Gujarati), "mix" (English + Gujarati accent lines)
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const GU_RE = /[઀-૿]/;

  /* =========================================================
     CONTENT — edit here. Every text has an English (en) and Gujarati (gu) version.
     ========================================================= */

  // Static page text, matched to data-i18n="key" in index.html
  const UI = {
    en: {
      intro: "welcome to our love story...", introCta: "Click to enter",
      navSangeet: "Sangeet", navWedding: "Wedding", navFaq: "FAQ", navRsvp: "RSVP",
      heroName: "Riya & Hemang", heroPrompt: "Scroll to explore",
      storyIntro: "you're cordially invited to celebrate the story of...", storyTitle: "our story",
      eventLead: "so please join us...", eventDate: "january 22 & 27, 2027",
      cdDays: "Days", cdHours: "Hours", cdMinutes: "Minutes", cdSeconds: "Seconds", until: "until the wedding",
      sangeetKicker: "The Sangeet", sangeetDate: "Friday, 22 January 2027", time: "6:00 PM onwards",
      sangeetVenue: "Bhanushali Wadi, Nerul", sangeetAddr: "Basveshewar Maharaj Marg, Sector 19A, Nerul East, Navi Mumbai 400706",
      weddingKicker: "The Wedding", weddingDate: "Wednesday, 27 January 2027",
      weddingVenue: "Aavishkaar Party Lawns & Banquet", weddingAddr: "Near Fatehpura High School, Fatepur, Nadiad, Gujarat 387370",
      rsvpTitle: "RSVP", rsvpNote: "call or text hemang or harsh", rsvpBtn: "RSVP now",
      detailsTitle: "and now some additional details...",
      detailsSub: "Two cities, two celebrations, and everything you need to be there for both.",
      vision: "Two very different people — one who plans everything, one who plans nothing at all — are doing the rest of it together.",
      faqTitle: "Questions and answers", faqHelp: "Can't find the answer here?", faqLink: "Reach out to Hemang or Harsh",
      faqOutro: "We cannot wait to celebrate with you.",
      footerQuote: "from a concert in Toronto to a mandap in Nadiad.",
      // used inside pop-ups
      call: "Call", whatsapp: "WhatsApp", rsvpContact: "RSVP contact", openMaps: "Open in Google Maps", mapTitle: "Map to the venue",
      rsvpListLabel: "When you get in touch", rsvpListSub: "Please let us know",
      rsvpItems: [
        "Your name, and whether you're from Riya's side or Hemang's side",
        "Which events you'll attend: Sangeet, Wedding, or both",
        "How many guests are coming with you",
        "Whether you need help with travel or a place to stay",
        "Any dietary needs",
      ],
    },
    gu: {
      intro: "અમારી પ્રેમકહાણીમાં આપનું સ્વાગત છે...", introCta: "પ્રવેશ કરવા ક્લિક કરો",
      navSangeet: "સંગીત", navWedding: "લગ્ન", navFaq: "પ્રશ્નો", navRsvp: "હાજરી જણાવો",
      heroName: "રિયા & હેમાંગ", heroPrompt: "આગળ જોવા સ્ક્રોલ કરો",
      storyIntro: "આ પ્રેમકહાણીની ઉજવણીમાં આપને ભાવભર્યું આમંત્રણ છે...", storyTitle: "અમારી વાર્તા",
      eventLead: "તો જરૂર પધારજો...", eventDate: "૨૨ અને ૨૭ જાન્યુઆરી, ૨૦૨૭",
      cdDays: "દિવસ", cdHours: "કલાક", cdMinutes: "મિનિટ", cdSeconds: "સેકન્ડ", until: "લગ્નના શુભ દિવસ સુધી",
      sangeetKicker: "સંગીત સંધ્યા", sangeetDate: "શુક્રવાર, ૨૨ જાન્યુઆરી ૨૦૨૭", time: "સાંજે ૬:૦૦ વાગ્યાથી",
      sangeetVenue: "ભાનુશાલી વાડી, નેરુલ", sangeetAddr: "બસવેશ્વર મહારાજ માર્ગ, સેક્ટર ૧૯એ, નેરુલ ઈસ્ટ, નવી મુંબઈ ૪૦૦૭૦૬",
      weddingKicker: "શુભ લગ્ન", weddingDate: "બુધવાર, ૨૭ જાન્યુઆરી ૨૦૨૭",
      weddingVenue: "આવિષ્કાર પાર્ટી લૉન્સ & બેન્ક્વેટ", weddingAddr: "ફતેહપુરા હાઈસ્કૂલ પાસે, ફતેપુર, નડિયાદ, ગુજરાત ૩૮૭૩૭૦",
      rsvpTitle: "હાજરી જણાવશો", rsvpNote: "હેમાંગ અથવા હર્ષને ફોન કે મેસેજ કરશો", rsvpBtn: "હાજરી જણાવો",
      detailsTitle: "અને હવે થોડી વધુ વિગતો...",
      detailsSub: "બે શહેર, બે ઉજવણી — અને બંનેમાં હાજર રહેવા માટે જરૂરી બધી માહિતી.",
      vision: "બે સાવ અલગ સ્વભાવના લોકો — એક જે બધું જ પ્લાન કરે, અને એક જે કંઈ જ પ્લાન ન કરે — હવે બાકીનું જીવન સાથે વિતાવશે.",
      faqTitle: "પ્રશ્નો અને જવાબો", faqHelp: "અહીં જવાબ ન મળ્યો?", faqLink: "હેમાંગ અથવા હર્ષનો સંપર્ક કરો",
      faqOutro: "આપની સાથે ઉજવણી કરવા અમે આતુર છીએ.",
      footerQuote: "ટોરોન્ટોના એક કોન્સર્ટથી નડિયાદના મંડપ સુધી.",
      call: "ફોન કરો", whatsapp: "વૉટ્સએપ", rsvpContact: "સંપર્ક", openMaps: "Google Maps માં ખોલો", mapTitle: "સ્થળનો નકશો",
      rsvpListLabel: "સંપર્ક કરો ત્યારે", rsvpListSub: "કૃપા કરીને જણાવશો",
      rsvpItems: [
        "આપનું નામ, અને આપ રિયા તરફથી છો કે હેમાંગ તરફથી",
        "આપ કયા પ્રસંગમાં પધારશો: સંગીત, લગ્ન, કે બંને",
        "આપની સાથે કેટલા મહેમાન આવશે",
        "પ્રવાસ કે રહેવાની વ્યવસ્થામાં મદદ જોઈએ છે કે નહીં",
        "ભોજન સંબંધિત કોઈ ખાસ જરૂરિયાત",
      ],
    },
  };

  // Gujarati accent lines shown only in "Mix" mode (data-accent="key")
  const ACCENT = {
    intro: "અમારી પ્રેમકહાણીમાં આપનું સ્વાગત છે",
    hero: "રિયા & હેમાંગ",
    storyIntro: "આ પ્રેમકહાણીની ઉજવણીમાં આપને ભાવભર્યું આમંત્રણ",
    storyTitle: "અમારી વાર્તા",
    eventLead: "જરૂર પધારજો",
    sangeetKicker: "સંગીત સંધ્યા",
    weddingKicker: "શુભ લગ્ન",
    rsvp: "આપની હાજરી જણાવશો",
    details: "થોડી વધુ વિગતો",
    vision: "એક જે બધું પ્લાન કરે, એક જે કંઈ પ્લાન ન કરે — હવે સાથે",
    faq: "પ્રશ્નો અને જવાબો",
    footer: "ટોરોન્ટોથી નડિયાદ સુધી",
  };

  // Every photo used on the site: [width, height, then the area to keep visible when a box has to crop it
  // (x0, y0, x1, y1 as fractions of the photo)]. The areas come from Apple Vision face/body detection.
  const PHOTOS = {
    1: [1200, 1600, 0.12, 0.311, 0.831, 0.635],
    3: [1200, 1600, 0.194, 0.29, 0.877, 0.605],
    4: [1200, 1600, 0.141, 0.232, 0.912, 0.773],
    5: [1200, 1600, 0.289, 0.225, 0.629, 0.429],
    6: [1200, 1600, 0.0, 0.249, 0.613, 0.639],
    7: [1200, 1600, 0.41, 0.385, 0.615, 0.519],
    8: [1200, 1600, 0.493, 0.462, 0.868, 0.711],
    9: [1200, 1600, 0.323, 0.18, 0.697, 0.405],
    10: [1200, 1600, 0.207, 0.293, 0.834, 0.588],
    11: [1200, 1600, 0.241, 0.423, 0.716, 0.672],
    12: [1200, 1600, 0.315, 0.19, 0.549, 0.377],
    13: [1200, 1600, 0.035, 0, 1, 0.862],
    16: [1200, 1600, 0.477, 0.158, 0.656, 0.33],
    17: [1067, 1600, 0.117, 0.196, 0.603, 0.374],
    18: [1200, 1600, 0, 0.223, 0.973, 0.626],
    19: [1200, 1600, 0.346, 0.297, 0.571, 0.424],
    20: [1200, 1600, 0.128, 0.207, 0.766, 0.433],
    21: [1200, 1600, 0.365, 0.327, 0.56, 0.448],
    22: [1600, 1200, 0.304, 0.264, 0.614, 0.688],
    23: [1200, 1600, 0.257, 0.252, 0.749, 0.654],
    24: [1600, 1066, 0.282, 0.155, 0.926, 0.485],
    25: [1066, 1600, 0.578, 0.6, 0.766, 0.729],
    26: [1066, 1600, 0.213, 0.556, 0.665, 0.662],
    27: [1066, 1600, 0.428, 0.474, 0.787, 0.586],
    28: [1066, 1600, 0.556, 0.468, 0.824, 0.756],
    29: [1200, 1600, 0.406, 0.43, 1, 0.493],
    30: [1600, 1066, 0.381, 0.296, 0.653, 0.486],
    31: [1066, 1600, 0.247, 0.535, 0.548, 0.651],
    32: [1066, 1600, 0.196, 0.563, 0.763, 0.705],
    33: [1600, 1066, 0.416, 0.323, 0.814, 0.532],
    34: [1200, 1600, 0.379, 0.284, 0.854, 0.5],
    35: [1200, 1600, 0.271, 0.312, 0.734, 0.49],
    36: [1066, 1600, 0.3, 0.2, 0.7, 0.6],
    37: [1600, 1066, 0.225, 0.31, 0.807, 0.667],
    38: [1200, 1600, 0.476, 0.423, 0.588, 0.517],
  };

  // Story chapters. photos: file numbers; captions per language in the same order.
  // Story photos are shown whole (each frame takes the photo's own shape), so nothing is cropped.
  const STORY = [
    {
      side: "left", photos: [1, 3, 4],
      en: {
        title: "chapter one: a concert, then hot chocolate",
        body: "We met for the first time at a concert — and somehow didn't take a single photo. Our second date was the Christmas tree lighting at the Distillery District: our first hot chocolate, and our very first picture together.",
        caps: ["The Distillery District, our first photo", "Our first December, twinkle lights & all", "Cold noses, warm hearts"],
      },
      gu: {
        title: "પ્રકરણ એક: એક કોન્સર્ટ, પછી હોટ ચોકલેટ",
        body: "અમે પહેલી વાર એક કોન્સર્ટમાં મળ્યા — અને ત્યારે એક પણ ફોટો ન પાડ્યો! અમારી બીજી ડેટ ડિસ્ટિલરી ડિસ્ટ્રિક્ટની ક્રિસમસ ટ્રી લાઇટિંગ હતી: ત્યાં અમે પહેલી વાર સાથે હોટ ચોકલેટ પીધી અને અમારો પહેલો ફોટો પાડ્યો.",
        caps: ["ડિસ્ટિલરી ડિસ્ટ્રિક્ટ, અમારો પહેલો ફોટો", "અમારો પહેલો ડિસેમ્બર, ઝગમગતી લાઇટો સાથે", "ઠંડું નાક, હૂંફાળું દિલ"],
      },
    },
    {
      side: "right", photos: [5, 6, 8, 9],
      en: {
        title: "chapter two: a season of firsts",
        body: "Our first big date was a seven-course dinner. Then came our first movie, our first Valentine's Day, and the real test — her helping me move from one place to the next.",
        caps: ["Seven courses, zero awkward silences", "Our first movie date", "Our first Valentine's", "Moving day, with the best helper"],
      },
      gu: {
        title: "પ્રકરણ બે: પહેલી વારની ઘણી યાદો",
        body: "અમારી પહેલી મોટી ડેટ સાત-કોર્સ ડિનર હતી. પછી આવી અમારી પહેલી મૂવી, પહેલો વેલેન્ટાઇન્સ ડે, અને સાચી કસોટી — એક ઘરથી બીજા ઘરે શિફ્ટ થવામાં તેણે કરેલી મદદ.",
        caps: ["સાત કોર્સ, અને વાતો ખૂટી જ નહીં", "અમારી પહેલી મૂવી ડેટ", "અમારો પહેલો વેલેન્ટાઇન્સ ડે", "શિફ્ટિંગનો દિવસ, સૌથી સારી મદદગાર સાથે"],
      },
    },
    {
      side: "left", photos: [7, 10, 11, 12, 13],
      en: {
        title: "chapter three: our city, our adventures",
        body: "Toronto became our playground — a day at Niagara Falls, spotting the FIFA World Cup trophy, wandering Allan Gardens, and joining the Portugal parade from Little Portugal to BMO Field for Portugal vs Croatia.",
        caps: ["Niagara Falls", "World Cup trophy sighting!", "Two fans, one golden trophy", "Allan Gardens", "The Portugal parade, for Ronaldo's second-last World Cup game"],
      },
      gu: {
        title: "પ્રકરણ ત્રણ: અમારું શહેર, અમારા સાહસો",
        body: "ટોરોન્ટો અમારું રમતનું મેદાન બની ગયું — નાયગ્રા ફૉલ્સની સફર, ફિફા વર્લ્ડ કપ ટ્રોફીના દર્શન, એલન ગાર્ડન્સમાં લટાર, અને પોર્ટુગલ વિરુદ્ધ ક્રોએશિયાની મેચ માટે લિટલ પોર્ટુગલથી BMO ફિલ્ડ સુધીની પોર્ટુગલ પરેડ.",
        caps: ["નાયગ્રા ફૉલ્સ", "વર્લ્ડ કપ ટ્રોફી દેખાઈ ગઈ!", "બે ચાહકો, એક સોનેરી ટ્રોફી", "એલન ગાર્ડન્સ", "પોર્ટુગલ પરેડ, રોનાલ્ડોની છેલ્લેથી બીજી વર્લ્ડ કપ મેચ માટે"],
      },
    },
    {
      side: "right", photos: [16, 17, 18, 19, 22],
      en: {
        title: "chapter four: mexico, garba & fall colours",
        body: "For her birthday we escaped to Mexico for a weekend. Then came our first Navratri together and our first fall colours hike up north.",
        caps: ["Her birthday weekend in Mexico", "Off-roading, birthday edition", "Making a splash in Mexico", "Our first Navratri", "Our first fall colours hike"],
      },
      gu: {
        title: "પ્રકરણ ચાર: મેક્સિકો, ગરબા અને પાનખરના રંગો",
        body: "તેના જન્મદિવસે અમે વીકએન્ડ માટે મેક્સિકો ગયા. પછી આવી અમારી સાથેની પહેલી નવરાત્રિ અને પાનખરના રંગો જોવા ઉત્તર તરફની અમારી પહેલી હાઇક.",
        caps: ["મેક્સિકોમાં તેનો બર્થડે વીકએન્ડ", "બર્થડે સ્પેશિયલ ઑફ-રોડિંગ", "મેક્સિકોમાં છબછબિયાં", "અમારી પહેલી નવરાત્રિ", "પાનખરના રંગોની અમારી પહેલી હાઇક"],
      },
    },
    {
      side: "left", photos: [32, 36, 26, 38],
      en: {
        title: "chapter five: the question",
        body: "A photoshoot for our wedding — or so she thought. Somewhere between the lake and the old stone buildings, I got down on one knee with a ring. The next day, we celebrated our first Diwali together.",
        caps: ["The surprise", "She said yes", "Engaged", "Our first Diwali"],
      },
      gu: {
        title: "પ્રકરણ પાંચ: એ સવાલ",
        body: "અમારા લગ્ન માટેનું ફોટોશૂટ — એવું તે માનતી હતી. તળાવ અને જૂની પથ્થરની ઇમારતો વચ્ચે ક્યાંક, હું વીંટી લઈને એક ઘૂંટણે બેસી ગયો. બીજા જ દિવસે અમે સાથે અમારી પહેલી દિવાળી ઉજવી.",
        caps: ["સરપ્રાઇઝ", "તેણે હા પાડી", "સગાઈ થઈ ગઈ", "અમારી પહેલી દિવાળી"],
      },
    },
  ];
  const ROTATIONS = [-2.5, 1.8, -1.2, 2.2, -1.6];

  const CONTACTS = [
    { en: "Hemang", gu: "હેમાંગ", tel: "+919769333516", display: "+91 97693 33516" },
    { en: "Harsh", gu: "હર્ષ", tel: "+918369894213", display: "+91 83698 94213" },
  ];
  const mapsEmbed = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
  const mapsLink = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  const CARDS = [
    { id: "sangeet", image: 20, en: ["Sangeet", "Friday, 22 January · Navi Mumbai"], gu: ["સંગીત", "શુક્રવાર, ૨૨ જાન્યુઆરી · નવી મુંબઈ"] },
    { id: "wedding", image: 31, en: ["Wedding", "Wednesday, 27 January · Nadiad"], gu: ["લગ્ન", "બુધવાર, ૨૭ જાન્યુઆરી · નડિયાદ"] },
    { id: "travel", image: 30, en: ["Travel & Stay", "Mumbai to Nadiad, and where to stay."], gu: ["પ્રવાસ અને રોકાણ", "મુંબઈથી નડિયાદ, અને ક્યાં રોકાવું."] },
    { id: "rsvp", image: 35, en: ["RSVP", "Call or text Hemang or Harsh."], gu: ["હાજરી જણાવો", "હેમાંગ અથવા હર્ષને ફોન કે મેસેજ કરો."] },
    { id: "hashtag", image: 27, en: ["#RiyaSangHemang", "Share every moment with us."], gu: ["#RiyaSangHemang", "દરેક પળ અમારી સાથે શેર કરો."] },
    { id: "more", image: 23, en: ["More to come", "Other celebrations, shared soon."], gu: ["હજી ઘણું બાકી છે", "બીજા પ્રસંગોની વિગતો ટૂંક સમયમાં."] },
  ];

  const OVERLAYS = {
    sangeet: {
      image: 20, map: "Bhanushali Wadi, Sector 19A, Nerul East, Navi Mumbai",
      en: {
        title: "Sangeet", description: "An evening of music and dance as both families come together in Navi Mumbai.",
        sections: [
          ["When", "Friday, 22 January 2027", "6:00 PM onwards"],
          ["Where", "Bhanushali Wadi, Nerul", "Basveshewar Maharaj Marg, Nerul East, Sector 19A, Nerul, Navi Mumbai, Maharashtra 400706, India"],
        ],
      },
      gu: {
        title: "સંગીત સંધ્યા", description: "નવી મુંબઈમાં સંગીત અને નૃત્યની એક સાંજ, જ્યાં બંને પરિવાર એકસાથે મળશે.",
        sections: [
          ["ક્યારે", "શુક્રવાર, ૨૨ જાન્યુઆરી ૨૦૨૭", "સાંજે ૬:૦૦ વાગ્યાથી"],
          ["ક્યાં", "ભાનુશાલી વાડી, નેરુલ", "બસવેશ્વર મહારાજ માર્ગ, નેરુલ ઈસ્ટ, સેક્ટર ૧૯એ, નેરુલ, નવી મુંબઈ, મહારાષ્ટ્ર ૪૦૦૭૦૬, ભારત"],
        ],
      },
    },
    wedding: {
      image: 31, map: "Aavishkaar Party Lawns & Banquet, Fatepur, Nadiad, Gujarat",
      en: {
        title: "Wedding", description: "Five days after the Sangeet, we celebrate the wedding in Riya's hometown, Nadiad.",
        sections: [
          ["When", "Wednesday, 27 January 2027", "6:00 PM onwards"],
          ["Where", "Aavishkaar Party Lawns & Banquet", "Near Fatehpura High School, Fatepur, Nadiad, Gujarat 387370, India"],
        ],
      },
      gu: {
        title: "શુભ લગ્ન", description: "સંગીતના પાંચ દિવસ પછી, રિયાના વતન નડિયાદમાં લગ્નની ઉજવણી.",
        sections: [
          ["ક્યારે", "બુધવાર, ૨૭ જાન્યુઆરી ૨૦૨૭", "સાંજે ૬:૦૦ વાગ્યાથી"],
          ["ક્યાં", "આવિષ્કાર પાર્ટી લૉન્સ & બેન્ક્વેટ", "ફતેહપુરા હાઈસ્કૂલ પાસે, ફતેપુર, નડિયાદ, ગુજરાત ૩૮૭૩૭૦, ભારત"],
        ],
      },
    },
    travel: {
      image: 30,
      en: {
        title: "Travel & Stay", description: "The Sangeet is in Navi Mumbai and the wedding is in Nadiad, Gujarat, five days later.",
        sections: [
          ["Mumbai to Nadiad", "Joining us for the wedding?", "If you're travelling from Mumbai to Nadiad, let us know when you RSVP and tell us if you'd like help planning the journey."],
          ["Staying over", "Need a place to stay?", "Mention it when you RSVP, for either city, and we'll help you sort it out."],
          ["Questions", "We're a call away", "Call or text Hemang (+91 97693 33516) or Harsh (+91 83698 94213) with anything you need."],
        ],
      },
      gu: {
        title: "પ્રવાસ અને રોકાણ", description: "સંગીત નવી મુંબઈમાં છે અને તેના પાંચ દિવસ પછી લગ્ન નડિયાદ, ગુજરાતમાં છે.",
        sections: [
          ["મુંબઈથી નડિયાદ", "લગ્નમાં પધારો છો?", "જો આપ મુંબઈથી નડિયાદ આવી રહ્યા હો, તો હાજરી જણાવતી વખતે અમને કહેજો, અને પ્રવાસના આયોજનમાં મદદ જોઈએ તો પણ જણાવજો."],
          ["રોકાણ", "રહેવાની વ્યવસ્થા જોઈએ છે?", "બંનેમાંથી કોઈ પણ શહેર માટે, હાજરી જણાવતી વખતે કહેજો — અમે વ્યવસ્થામાં મદદ કરીશું."],
          ["પ્રશ્નો", "અમે એક ફોન દૂર છીએ", "કંઈ પણ જરૂર હોય તો હેમાંગ (+91 97693 33516) અથવા હર્ષ (+91 83698 94213) ને ફોન કે મેસેજ કરો."],
        ],
      },
    },
    rsvp: {
      image: 35, rsvp: true,
      en: { title: "RSVP", description: "Kindly let us know which celebrations you'll be joining by calling or texting Hemang or Harsh." },
      gu: { title: "હાજરી જણાવો", description: "આપ કયા પ્રસંગોમાં પધારશો તે હેમાંગ અથવા હર્ષને ફોન કે મેસેજ કરીને જણાવશો." },
    },
    hashtag: {
      image: 27,
      en: {
        title: "#RiyaSangHemang", description: "Snap, post and tag — we'd love to see both celebrations through your eyes.",
        sections: [["Our hashtag", "#RiyaSangHemang", "Use it on Instagram, WhatsApp statuses and anywhere else you share photos from the Sangeet and the wedding."]],
      },
      gu: {
        title: "#RiyaSangHemang", description: "ફોટો પાડો, પોસ્ટ કરો અને ટૅગ કરો — બંને ઉજવણી આપની નજરે જોવી અમને ગમશે.",
        sections: [["અમારો હેશટૅગ", "#RiyaSangHemang", "સંગીત અને લગ્નના ફોટા ઇન્સ્ટાગ્રામ, વૉટ્સએપ સ્ટેટસ કે બીજે ક્યાંય પણ શેર કરો ત્યારે આ હેશટૅગ વાપરજો."]],
      },
    },
    more: {
      image: 23,
      en: {
        title: "More to come", description: "The Sangeet and the wedding are just the beginning.",
        sections: [["Coming soon", "Other celebrations", "Details of the other wedding events will be shared here soon. Check back closer to the dates."]],
      },
      gu: {
        title: "હજી ઘણું બાકી છે", description: "સંગીત અને લગ્ન તો માત્ર શરૂઆત છે.",
        sections: [["ટૂંક સમયમાં", "બીજા પ્રસંગો", "લગ્નના બીજા પ્રસંગોની વિગતો અહીં ટૂંક સમયમાં જણાવીશું. તારીખો નજીક આવે ત્યારે ફરી જોજો."]],
      },
    },
  };

  const FAQ = {
    en: [
      ["When and where is the Sangeet?", ["Friday, 22 January 2027, from 6:00 PM at Bhanushali Wadi, Basveshewar Maharaj Marg, Sector 19A, Nerul East, Navi Mumbai."]],
      ["When and where is the wedding?", ["Wednesday, 27 January 2027, from 6:00 PM at Aavishkaar Party Lawns & Banquet, near Fatehpura High School, Fatepur, Nadiad, Gujarat."]],
      ["How do I RSVP?", ["Call or text Hemang (+91 97693 33516) or Harsh (+91 83698 94213).", "Let us know which events you'll attend and how many of you are coming."]],
      ["I'm travelling from Mumbai to Nadiad. Can you help?", ["Yes. Tell us when you RSVP whether you need help with travel or a place to stay, and we'll help you plan."]],
      ["I have dietary needs. Who should I tell?", ["Mention any dietary needs when you RSVP and we'll take care of it."]],
      ["Are there any other events?", ["More celebrations are being planned. We'll share the details here soon."]],
      ["Do you have a wedding hashtag?", ["Yes! Please share your photos with #RiyaSangHemang."]],
    ],
    gu: [
      ["સંગીત ક્યારે અને ક્યાં છે?", ["શુક્રવાર, ૨૨ જાન્યુઆરી ૨૦૨૭, સાંજે ૬:૦૦ વાગ્યાથી, ભાનુશાલી વાડી, બસવેશ્વર મહારાજ માર્ગ, સેક્ટર ૧૯એ, નેરુલ ઈસ્ટ, નવી મુંબઈ."]],
      ["લગ્ન ક્યારે અને ક્યાં છે?", ["બુધવાર, ૨૭ જાન્યુઆરી ૨૦૨૭, સાંજે ૬:૦૦ વાગ્યાથી, આવિષ્કાર પાર્ટી લૉન્સ & બેન્ક્વેટ, ફતેહપુરા હાઈસ્કૂલ પાસે, ફતેપુર, નડિયાદ, ગુજરાત."]],
      ["હાજરી કેવી રીતે જણાવું?", ["હેમાંગ (+91 97693 33516) અથવા હર્ષ (+91 83698 94213) ને ફોન કે મેસેજ કરો.", "આપ કયા પ્રસંગોમાં પધારશો અને કેટલા લોકો આવશો તે જણાવજો."]],
      ["હું મુંબઈથી નડિયાદ આવું છું. મદદ મળશે?", ["હા. હાજરી જણાવતી વખતે કહેજો કે પ્રવાસ કે રહેવાની વ્યવસ્થામાં મદદ જોઈએ છે, અમે આયોજનમાં મદદ કરીશું."]],
      ["ભોજન સંબંધિત ખાસ જરૂરિયાત છે. કોને કહું?", ["હાજરી જણાવતી વખતે જ કહેજો, અમે ધ્યાન રાખીશું."]],
      ["બીજા કોઈ પ્રસંગો છે?", ["બીજી ઉજવણીઓનું આયોજન ચાલી રહ્યું છે. વિગતો અહીં ટૂંક સમયમાં જણાવીશું."]],
      ["લગ્નનો કોઈ હેશટૅગ છે?", ["હા! આપના ફોટા #RiyaSangHemang સાથે શેર કરજો."]],
    ],
  };

  // Wedding: 2027-01-27 18:00 IST (UTC+5:30)
  const COUNTDOWN_TARGET = Date.UTC(2027, 0, 27, 12, 30, 0);
  const img = (n) => `assets/rh/${n}.jpg`;

  // Places a photo inside its box (bw x bh) so both faces are always fully visible.
  // Normally the photo fills the box (like object-fit: cover), centred on the faces. When the box is too
  // narrow or too short for that (e.g. a wide photo on a tall phone screen), the photo shrinks just enough
  // to fit both faces and the leftover space shows a soft blurred copy of the same photo.
  function placeFocus(el, n, bw, bh) {
    const p = PHOTOS[n];
    if (!p || !bw || !bh) return;
    const [W, H, x0, y0, x1, y1] = p;
    const m = 0.03; // a little breathing room around the faces
    const fx0 = clamp(x0 - m), fx1 = clamp(x1 + m), fy0 = clamp(y0 - m), fy1 = clamp(y1 + m);
    const cover = Math.max(bw / W, bh / H);
    const fit = Math.min(bw / ((fx1 - fx0) * W), bh / ((fy1 - fy0) * H));
    const fitTight = Math.min(bw / ((x1 - x0) * W), bh / ((y1 - y0) * H));
    // fill the box whenever the faces themselves fit; only shrink (with breathing room) when they don't
    const sc = cover <= fitTight ? cover : Math.min(cover, fit);
    const dw = W * sc, dh = H * sc;
    const place = (box, d, a0, a1) => (d >= box ? clamp(box / 2 - ((a0 + a1) / 2) * d, box - d, 0) : (box - d) / 2);
    el.style.width = `${dw}px`;
    el.style.height = `${dh}px`;
    el.style.left = `${place(bw, dw, fx0, fx1)}px`;
    el.style.top = `${place(bh, dh, fy0, fy1)}px`;
    const parent = el.parentElement;
    const needsFill = dw < bw - 1 || dh < bh - 1;
    let fill = parent.querySelector(":scope > .blurfill");
    if (needsFill && !fill) {
      fill = document.createElement("img");
      fill.className = "blurfill";
      fill.alt = "";
      fill.setAttribute("aria-hidden", "true");
      fill.src = el.getAttribute("src");
      parent.insertBefore(fill, parent.firstChild);
    }
    if (fill) fill.hidden = !needsFill;
    // tells the CSS which edges to fade into the blur ("v" = top/bottom, "h" = left/right)
    el.dataset.fill = !needsFill ? "" : (dh < bh - 1 ? "v" : "") + (dw < bw - 1 ? "h" : "");
  }
  function applyFocus(root = document) {
    $$("img[data-n]", root).forEach((el) => {
      const box = el.parentElement;
      placeFocus(el, +el.dataset.n, box.clientWidth, box.clientHeight);
    });
  }

  /* =========================================================
     LANGUAGE STATE
     ========================================================= */
  const LANG_KEY = "rh-lang";
  const LABEL = { en: "EN", gu: "ગુજ", mix: "Mix" };
  const readLang = () => {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && LABEL[q]) return q;
    try { const s = localStorage.getItem(LANG_KEY); if (s && LABEL[s]) return s; } catch { /* storage unavailable */ }
    return "en";
  };
  let lang = readLang();
  const tl = () => (lang === "gu" ? "gu" : "en"); // which text set to show
  const mix = () => lang === "mix";
  const T = (key) => UI[tl()][key];
  const guNum = new Intl.NumberFormat("gu-IN-u-nu-gujr", { useGrouping: false });
  const num = (n) => (lang === "gu" ? guNum.format(n) : String(n));

  /* ---------------- INTRO ---------------- */
  const intro = $("#intro");
  const introText = $("#introText");
  function splitIntro() {
    const txt = T("intro");
    introText.textContent = "";
    // Gujarati letters combine with vowel signs, so it animates word by word instead of letter by letter.
    // Spaces stay real text so the line can wrap on phones; English letters sit inside an unbreakable word.
    const gu = GU_RE.test(txt);
    let i = 0;
    const piece = (text) => {
      const s = document.createElement("span");
      s.textContent = text;
      s.style.animationDelay = `${0.25 + i++ * (gu ? 0.16 : 0.045)}s`;
      return s;
    };
    txt.split(" ").forEach((word, wi) => {
      if (wi > 0) { introText.appendChild(document.createTextNode(" ")); i++; }
      if (gu) { introText.appendChild(piece(word)); return; }
      const w = document.createElement("span");
      w.className = "intro__word";
      [...word].forEach((ch) => w.appendChild(piece(ch)));
      introText.appendChild(w);
    });
  }
  const enter = () => {
    if (intro.classList.contains("is-gone")) return;
    intro.classList.add("is-gone");
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
  };
  intro.addEventListener("click", enter);
  intro.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); } });

  /* ---------------- NAV ---------------- */
  const nav = $("#nav");
  $$("[data-scrolltop]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
  $$("[data-scrollto]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById(a.dataset.scrollto).scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  /* ---------------- HERO ---------------- */
  const hero = $("#hero");
  const heroMain = $("#heroMain");
  const heroTitle = $("#heroTitle");
  const heroName = $("#heroName");
  const heroImg = $("img", heroMain);
  const HERO_PHOTO = 37;
  const heroPrompt = $("#heroPrompt");
  const gallery = $$(".hero__g");
  const G_START = [0.0, 0.035, 0.07, 0.28];
  const G_DIR = [-1, -1, 1, 1];
  let heroP = 0;
  let nameW100 = 1; // width of the name at a 100px font size, measured per language

  function measureName() {
    const prev = heroTitle.style.fontSize;
    heroTitle.style.fontSize = "100px";
    nameW100 = heroName.getBoundingClientRect().width || 1;
    heroTitle.style.fontSize = prev;
  }

  function renderHero(target) {
    const vw = window.innerWidth, vh = window.innerHeight;
    heroP += (target - heroP) * 0.16;
    if (Math.abs(target - heroP) < 0.0005) heroP = target;
    const p = heroP;
    // phones, and tablets held upright, use the phone layout for this section
    const mobile = vw < 768 || (vh > vw * 1.15 && vw < 1100);

    const x0 = vw * 0.015, y0 = 14, w0 = vw - x0 * 2, h0 = vh - 27;
    // on phones the photo settles into a box shaped like the photo itself, so nothing is cut
    // (it stays in the gap between the top and bottom side photos: at most 33% of the screen height)
    const ratio = PHOTOS[HERO_PHOTO][0] / PHOTOS[HERO_PHOTO][1];
    const w1 = mobile ? Math.min(vw * 0.86, vh * 0.33 * ratio) : vw * 0.485;
    const h1 = mobile ? w1 / ratio : vh * 0.829;
    const x1 = (vw - w1) / 2, y1 = (vh - h1) / 2 + (mobile ? 0 : vh * 0.022);
    const w = lerp(w0, w1, p), h = lerp(h0, h1, p);
    heroMain.style.left = `${lerp(x0, x1, p)}px`;
    heroMain.style.top = `${lerp(y0, y1, p)}px`;
    heroMain.style.width = `${w}px`;
    heroMain.style.height = `${h}px`;
    heroMain.style.borderRadius = `${lerp(18, 41, p)}px`;
    placeFocus(heroImg, HERO_PHOTO, w, h);

    // the name always spans ~64% of the photo's width, whatever the language
    heroTitle.style.fontSize = `${(w * (mobile ? 0.82 : 0.64)) / nameW100 * 100}px`;
    heroTitle.style.opacity = 1 - clamp((p - 0.12) / 0.5);
    heroPrompt.style.opacity = 1 - clamp(p / 0.12);

    gallery.forEach((g, i) => {
      const t = clamp((p - G_START[i]) / 0.62);
      const e = easeOutCubic(t);
      const tx = (1 - e) * G_DIR[i] * vw * 0.5;
      const ty = (1 - e) * vh * 0.444;
      g.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${0.96 + 0.04 * e})`;
      g.style.opacity = clamp(t * 6);
    });
    return heroP !== target;
  }

  /* ---------------- WORD REVEAL ---------------- */
  let wordBlocks = [];
  function splitWords() {
    wordBlocks = $$("[data-words]").map((p) => {
      const words = p.textContent.trim().split(/\s+/);
      p.innerHTML = words.map((w) => `<span>${esc(w)}</span>`).join(" ");
      return { p, spans: $$("span", p) };
    });
  }
  function renderWords() {
    const vh = window.innerHeight;
    wordBlocks.forEach(({ p, spans }) => {
      const r = p.getBoundingClientRect();
      const prog = (vh * 0.8 - r.top) / (r.height + vh * 0.45);
      const lit = Math.floor(clamp(prog) * spans.length + (prog > 0 ? 0.5 : 0));
      spans.forEach((s, i) => s.classList.toggle("is-lit", i < lit));
    });
  }

  /* ---------------- STORY (sticky polaroid stack) ---------------- */
  const story = $("#story");
  const stage = $("#storyStage");
  let cards = [];
  let chapters = [];
  let chaptersM = [];
  const CH_W = [0.324, 0.35, 0.37, 0.39, 0.4125];
  const CH_H = [0.399, 0.43, 0.455, 0.48, 0.507];
  const GAP = 420;

  function buildStory() {
    [...chapters, ...chaptersM, ...cards.map((c) => c.el)].forEach((el) => el.remove());
    cards = []; chapters = []; chaptersM = [];
    STORY.forEach((ch, ci) => {
      const t = ch[tl()];
      const accent = mix() ? `<span class="accent accent--chapter">${esc(ch.gu.title)}</span>` : "";
      const text = `<h3>${esc(t.title)}${accent}</h3><p>${esc(t.body)}</p>`;
      const c = document.createElement("div");
      c.className = "chapter";
      c.innerHTML = ch.side === "left"
        ? `<div class="chapter__col chapter__col--left">${text}</div><div class="chapter__spacer"></div><div class="chapter__col"></div>`
        : `<div class="chapter__col"></div><div class="chapter__spacer"></div><div class="chapter__col chapter__col--right">${text}</div>`;
      stage.appendChild(c);
      chapters.push(c);

      const m = document.createElement("div");
      m.className = "chapter-m";
      m.innerHTML = text;
      stage.appendChild(m);
      chaptersM.push(m);

      ch.photos.forEach((n, pi) => {
        const cap = t.caps[pi];
        const k = cards.length;
        const wrap = document.createElement("div");
        wrap.className = "polaroid-wrap";
        wrap.innerHTML = `
          <div class="polaroid" style="transform: rotate(${ROTATIONS[pi % ROTATIONS.length]}deg)" role="button" tabindex="0" aria-label="${esc(cap)}">
            <div class="polaroid__img" style="aspect-ratio:${PHOTOS[n][0]} / ${PHOTOS[n][1]}"><img src="${img(n)}" alt="${esc(cap)}" loading="${k < 3 ? "eager" : "lazy"}" decoding="async" /></div>
            <p class="polaroid__cap">${esc(cap)}</p>
          </div>`;
        const pol = $(".polaroid", wrap);
        const open = () => openLightbox(img(n), cap);
        pol.addEventListener("click", open);
        pol.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
        stage.appendChild(wrap);
        cards.push({ el: wrap, chapter: ci, i: pi, n });
      });
    });
    lastChapter = -1;
  }

  let storyGeom = null;
  function layoutStory() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = vh / 900;
    const mobile = vw < 768;
    // in Mix mode the Gujarati line under "our story" needs a little room above the stack
    const off = mix() ? 50 : 0;
    const step = mix() ? 20 : 26;
    const stack = cards.map((c) => mobile
      ? vh * 0.19 + off * 0.6 + c.chapter * 6 + c.i * 6
      : s * (255 + off + c.chapter * step + c.i * 17));
    // widest a landscape card may get in each chapter (grows a little per chapter, like the template)
    const maxW = STORY.map((_, ci) => (mobile ? vw * 0.82 : vw * CH_W[ci % CH_W.length]));
    cards.forEach((c, k) => {
      const [pw, ph] = PHOTOS[c.n];
      // frame height ≈ width × (top border + photo + caption strip)
      const perW = 0.045 + 0.91 * (ph / pw) + 0.16;
      const room = mobile
        ? vh * 0.64 - stack[k]
        : Math.min(vh * CH_H[c.chapter % CH_H.length] * 1.12, vh - stack[k] - 22 * s);
      c.w = Math.max(140, Math.min(maxW[c.chapter], room / perW));
      c.el.style.width = `${c.w}px`;
    });
    // the text sits beside the pile, which still holds photos from earlier chapters, so clear the widest so far
    chapters.forEach((ch, i) => {
      const ws = cards.filter((c) => c.chapter <= i).map((c) => c.w);
      $(".chapter__spacer", ch).style.width = `${Math.max(...ws) + 24}px`;
    });
    const natural = cards.map((_, k) => s * (291 + off) + s * GAP * k);
    const last = cards.length - 1;
    const range = natural[last] - stack[last] + vh * 0.15;
    story.style.height = `${range + vh}px`;
    storyGeom = { stack, natural, range };
  }

  let lastChapter = -1;
  function renderStory() {
    if (!storyGeom) return;
    const top = story.getBoundingClientRect().top;
    const d = clamp(-top, 0, storyGeom.range);
    let landed = 0;
    cards.forEach((c, k) => {
      const nat = storyGeom.natural[k] - d;
      const st = storyGeom.stack[k];
      if (nat <= st + 0.5) landed = k + 1;
      c.el.style.transform = `translate3d(-50%, ${Math.max(st, nat)}px, 0)`;
    });
    const active = landed === 0 ? 0 : cards[landed - 1].chapter;
    if (active !== lastChapter) {
      chapters.forEach((c, i) => c.classList.toggle("is-active", i === active));
      chaptersM.forEach((c, i) => c.classList.toggle("is-active", i === active));
      lastChapter = active;
    }
  }

  /* ---------------- MAIN LOOP ---------------- */
  let ticking = false;
  function frame() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 30);
    const range = (hero.offsetHeight - window.innerHeight) * (1000 / 1200);
    const target = clamp((y - hero.offsetTop) / range);
    const moving = renderHero(target);
    renderWords();
    renderStory();
    if (moving) requestAnimationFrame(frame);
    else ticking = false;
  }
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", () => { layoutStory(); measureName(); applyFocus(); heroP = -1; requestFrame(); });
  document.addEventListener("load", (e) => { if (e.target.matches && e.target.matches("img[data-n]")) applyFocus(e.target.parentElement); }, true);

  /* ---------------- REVEAL ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach((el) => io.observe(el));

  /* ---------------- COUNTDOWN ---------------- */
  const cd = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
  function tick() {
    let diff = Math.max(0, COUNTDOWN_TARGET - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    cd.d.textContent = num(d); cd.h.textContent = num(h); cd.m.textContent = num(m); cd.s.textContent = num(s);
  }
  setInterval(tick, 1000);

  /* ---------------- CONFETTI ---------------- */
  (() => {
    const canvas = $("#confetti");
    const ctx = canvas.getContext("2d");
    const COLORS = ["#e9a7b8", "#f1cf6a", "#a6c98f", "#e7c9a6", "#d47f92", "#f6e2b3", "#b9d4a6"];
    let W = 0, H = 0, dpr = 1, parts = [], running = false, raf = 0;
    const spawn = (anywhere) => ({
      x: Math.random() * W, y: anywhere ? Math.random() * H : -10,
      r: 1.6 + Math.random() * 2.4, vy: 0.25 + Math.random() * 0.55,
      sway: Math.random() * Math.PI * 2, swaySpeed: 0.005 + Math.random() * 0.015,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.04,
      shape: Math.random() < 0.55 ? 0 : 1, c: COLORS[(Math.random() * COLORS.length) | 0], a: 0.55 + Math.random() * 0.45,
    });
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: Math.round(clamp(W / 1440, 0.4, 1.2) * 140) }, () => spawn(true));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.sway += p.swaySpeed; p.y += p.vy; p.x += Math.sin(p.sway) * 0.35; p.rot += p.vr;
        if (p.y > H + 10) Object.assign(p, spawn(false));
        const edge = Math.min(p.y / (H * 0.18), (H - p.y) / (H * 0.18), 1);
        ctx.globalAlpha = p.a * clamp(edge);
        ctx.fillStyle = p.c;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        if (p.shape === 0) { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        ctx.restore();
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    size();
    window.addEventListener("resize", size);
    new IntersectionObserver(([en]) => {
      running = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(draw);
    }).observe(canvas);
  })();

  /* ---------------- DETAILS GRID ---------------- */
  const plusSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
  let gridBuilt = false;
  function buildGrid() {
    $("#detailsGrid").innerHTML = CARDS.map((c, i) => {
      const [title, sub] = c[tl()];
      const accent = mix() && c.gu[0] !== c.en[0] ? `<span class="accent accent--card">${esc(c.gu[0])}</span>` : "";
      return `
      <div data-reveal class="${gridBuilt ? "is-in" : ""}" style="transition-delay:${(i % 3) * 90}ms">
        <button class="dcard" data-overlay="${c.id}" aria-label="${esc(title)}">
          <img src="${img(c.image)}" data-n="${c.image}" alt="" loading="lazy" />
          <div class="dcard__text">${accent}<h3>${esc(title)}</h3><p>${esc(sub)}</p></div>
          <span class="dcard__plus">${plusSvg}</span>
        </button>
      </div>`;
    }).join("");
    if (!gridBuilt) $$("#detailsGrid [data-reveal]").forEach((el) => io.observe(el));
    gridBuilt = true;
  }

  /* ---------------- FAQ ---------------- */
  const chevron = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
  function buildFaq() {
    const list = $("#faqList");
    list.innerHTML = FAQ[tl()].map(([q, a], i) => `
      <div class="faq__item">
        <button class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}"><span>${esc(q)}${mix() ? `<small class="accent accent--faq">${esc(FAQ.gu[i][0])}</small>` : ""}</span><i class="faq__icon">${chevron}</i></button>
        <div class="faq__a" id="faq-a-${i}" role="region"><div>${a.map((p) => `<p>${esc(p)}</p>`).join("")}</div></div>
      </div>`).join("");
    $$(".faq__q", list).forEach((b) => b.addEventListener("click", () => {
      const item = b.parentElement;
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      b.setAttribute("aria-expanded", open);
    }));
  }

  /* ---------------- SHEET (overlay pages) ---------------- */
  const sheet = $("#sheet");
  const sheetTitle = $("#sheetTitle");
  const sheetBody = $("#sheetBody");
  const panel = $(".sheet__panel", sheet);
  let lastFocus = null;
  let openId = null;

  function openSheet(id) {
    lastFocus = document.activeElement;
    openId = id;
    renderSheet();
    panel.scrollTop = 0;
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".sheet__x", sheet).focus({ preventScroll: true }), 50);
  }
  function closeSheet() {
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openId = null;
    setTimeout(() => { if (!sheet.classList.contains("is-open")) sheetBody.innerHTML = ""; }, 600);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $$("[data-close]", sheet).forEach((b) => b.addEventListener("click", closeSheet));

  const contactHtml = () => `
    <div class="contacts">${CONTACTS.map((c) => `
      <div class="contact">
        <p class="op__label">${esc(T("rsvpContact"))}</p>
        <p class="contact__name">${esc(c[tl()])}</p>
        <p class="contact__num">${esc(c.display)}</p>
        <div class="contact__btns">
          <a class="btn-pill btn-pill--sm" href="tel:${c.tel}">${esc(T("call"))}</a>
          <a class="btn-line" href="https://wa.me/${c.tel.replace("+", "")}" target="_blank" rel="noopener">${esc(T("whatsapp"))}</a>
        </div>
      </div>`).join("")}
    </div>`;

  function renderSheet() {
    if (!openId) return;
    const o = OVERLAYS[openId];
    const t = o[tl()];
    sheetTitle.textContent = t.title;
    const accent = mix() && o.gu.title !== o.en.title ? `<span class="accent accent--op">${esc(o.gu.title)}</span>` : "";
    // banners are wide (2.3:1) but get taller when that's needed to fit both faces
    const [bw0, bh0, , by0, , by1] = PHOTOS[o.image];
    const bannerRatio = clamp((bw0 / bh0) / (by1 - by0 + 0.06), 1.5, 2.3).toFixed(3);
    let h = `<div class="op__banner" style="aspect-ratio:${bannerRatio}"><img src="${img(o.image)}" data-n="${o.image}" alt="" /></div>
             <h1 class="op__title">${esc(t.title)}${accent}</h1>
             <p class="op__desc">${esc(t.description)}</p>`;
    if (t.sections) {
      h += t.sections.map(([label, sub, body]) => `
        <div class="op__sec">
          <p class="op__label">${esc(label)}</p>
          <p class="op__sub">${esc(sub)}</p>
          <div class="op__body">${body.split("\n\n").map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        </div>`).join("");
    }
    if (o.map) {
      h += `<iframe class="op__map" src="${mapsEmbed(o.map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${esc(T("mapTitle"))}"></iframe>
            <a class="btn-pill op__mapbtn" href="${mapsLink(o.map)}" target="_blank" rel="noopener">${esc(T("openMaps"))}</a>`;
    }
    if (o.rsvp) {
      h += `${contactHtml()}
        <div class="op__sec">
          <p class="op__label">${esc(T("rsvpListLabel"))}</p>
          <p class="op__sub">${esc(T("rsvpListSub"))}</p>
          <ul class="op__list">${T("rsvpItems").map((li) => `<li>${esc(li)}</li>`).join("")}</ul>
        </div>`;
    }
    sheetBody.innerHTML = h;
    requestAnimationFrame(() => applyFocus(sheetBody));
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-overlay]");
    if (!t) return;
    e.preventDefault();
    openSheet(t.dataset.overlay);
  });

  /* ---------------- LIGHTBOX ---------------- */
  const lb = $("#lightbox");
  function openLightbox(src, cap) {
    $("#lightboxCard").innerHTML = `<img src="${src}" alt="${esc(cap)}" /><figcaption>${esc(cap)}</figcaption>`;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
  }
  const closeLightbox = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); };
  $$("[data-close-lb]", lb).forEach((b) => b.addEventListener("click", closeLightbox));

  /* ---------------- LANGUAGE SWITCHER ---------------- */
  const langBox = $("#lang");
  const langToggle = $("#langToggle");

  function applyLang() {
    const root = document.documentElement;
    root.lang = lang === "gu" ? "gu" : "en";
    root.dataset.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = T(el.dataset.i18n); });
    $$("[data-accent]").forEach((el) => { el.textContent = ACCENT[el.dataset.accent] || ""; });
    langToggle.textContent = LABEL[lang];
    $$("[data-lang]", langBox).forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    splitIntro();
    splitWords();
    buildStory();
    layoutStory();
    buildGrid();
    buildFaq();
    renderSheet();
    applyFocus();
    tick();
    measureName();
    heroP = -1;
    requestFrame();
  }

  langToggle.addEventListener("click", (e) => { e.stopPropagation(); langBox.classList.toggle("is-open"); });
  $$("[data-lang]", langBox).forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    lang = b.dataset.lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* storage unavailable */ }
    langBox.classList.remove("is-open");
    applyLang();
  }));
  document.addEventListener("click", () => langBox.classList.remove("is-open"));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (lb.classList.contains("is-open")) closeLightbox();
    else if (sheet.classList.contains("is-open")) closeSheet();
    langBox.classList.remove("is-open");
  });

  /* ---------------- CLICK HEARTS ---------------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, input, textarea, label, .sheet, .lightbox, .intro, .polaroid, .lang")) return;
    if (!intro.classList.contains("is-gone")) return;
    for (let i = 0; i < 7; i++) {
      const h = document.createElement("span");
      h.className = "heart";
      h.textContent = "♥";
      h.style.left = `${e.clientX - 9}px`;
      h.style.top = `${e.clientY - 9}px`;
      h.style.fontSize = `${12 + Math.random() * 12}px`;
      document.body.appendChild(h);
      const ang = (Math.random() * 0.9 + 0.05) * Math.PI;
      const dist = 40 + Math.random() * 70;
      h.animate([
        { transform: "translate(0,0) scale(0.4)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px, ${-Math.sin(ang) * dist - 30}px) scale(1)`, opacity: 0 },
      ], { duration: 800 + Math.random() * 500, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => h.remove();
    }
  });

  /* ---------------- START ---------------- */
  applyLang();
  // re-measure the hero name once the web fonts (incl. Gujarati) have loaded
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureName(); heroP = -1; requestFrame(); });
})();
