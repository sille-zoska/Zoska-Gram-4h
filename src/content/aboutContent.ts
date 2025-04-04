// src/content/aboutContent.ts

// TypeScript interfaces
interface Link {
  label: string;
  url: string;
}

interface Feature {
  title: string;
  description: string;
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
  introduction: "ZoškaGram, je výtvorom nás – mladých študentov zo Strednej priemyselnej školy elektrotechnickej na Zochovej 9 v Bratislave. Ako hovoríme my: „Žijeme život naplno a chceme to ukázať celému svetu!",
  features: [
    {
      title: "Zdieľanie momentov",
      description: "Zdieľajte svoje najlepšie momenty zo školského života"
    },
    {
      title: "Komunita",
      description: "Spojte sa s ostatnými študentmi a vytvorte si vlastnú sieť"
    },
    {
      title: "Zábava",
      description: "Užite si zábavný obsah a interakcie s priateľmi"
    }
  ],
  links: [
    {
      label: "Naša škola",
      url: "https://zochova.sk/"
    },
    {
      label: "Facebook",
      url: "https://www.facebook.com/spsezochova/"
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/spsezochova/"
    },
  ],
  footer: "Tešíme sa na vaše nápady, fotky z vtipných situácií a – no, vlastne na všetko, čo robí život študenta na Zoške tak výnimočným. Vitajte v našej Zoške!"
};

export default aboutContent;
