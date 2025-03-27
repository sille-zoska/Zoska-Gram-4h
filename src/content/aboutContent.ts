// src/content/aboutContent.ts

// TypeScript interfaces
interface Link {
  label: string;
  url: string;
  icon?: string; // Optional icon name for the link
}

interface Feature {
  title: string;
  description: string;
  icon?: string; // Optional icon name for the feature
}

interface AboutContent {
  title: string;
  subtitle: string;
  introduction: string;
  features: Feature[];
  links: Link[];
  footer: string;
}

// Content definition
const aboutContent: AboutContent = {
  title: "O ZoskaGram",
  subtitle: "Najdivokejšia platforma (nielen) pre študentov Zošky!",
  introduction: "ZoskaGram, známy tiež ako ZoškaSnap, je výtvorom nás – mladých, nespútaných a večne usmievavých študentov zo Spojenej školy na Zochovej 9 v Bratislave. Ako hovoríme my: „Žijeme život naplno a chceme to ukázať celému svetu!",
  features: [
    {
      title: "Zdieľanie momentov",
      description: "Zdieľajte svoje najlepšie momenty zo školského života",
      icon: "photo_camera"
    },
    {
      title: "Komunita",
      description: "Spojte sa s ostatnými študentmi a vytvorte si vlastnú sieť",
      icon: "group"
    },
    {
      title: "Zábava",
      description: "Užite si zábavný obsah a interakcie s priateľmi",
      icon: "mood"
    }
  ],
  links: [
    {
      label: "Naša škola",
      url: "https://zochova.sk/",
      icon: "school"
    },
    {
      label: "Facebook",
      url: "https://www.facebook.com/spsezochova/",
      icon: "facebook"
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/spsezochova/",
      icon: "photo_camera"
    },
  ],
  footer: "Tešíme sa na vaše šialené nápady, fotky z vtipných situácií a – no, vlastne na všetko, čo robí život študenta na Zoške tak výnimočným. Vitajte v našej rodine na Zochovej 9!"
};

export default aboutContent;
