// src/content/gdprContent.ts

// TypeScript interfaces
interface Section {
  heading: string;
  text: string;
  icon?: string; // Optional icon name for the section
}

interface GDPRContent {
  title: string;
  subtitle: string;
  introduction: string;
  sections: Section[];
  footer: string;
  contactEmail: string;
}

// Content definition
const gdprContent: GDPRContent = {
  title: "GDPR - Ochrana osobných údajov",
  subtitle: "Vaša súkromie je pre nás prioritou",
  introduction: "Vaša ochrana súkromia je pre nás veľmi dôležitá. V tomto dokumente sa dozviete, ako spracúvame a chránime vaše osobné údaje v súlade s nariadením GDPR.",
  sections: [
    {
      heading: "Zodpovednosť",
      text: "Všetky osobné údaje, ktoré nám poskytnete, budú použité iba na účely, na ktoré boli poskytnuté. Zaväzujeme sa k maximálnej transparentnosti pri spracovaní vašich údajov.",
      icon: "security"
    },
    {
      heading: "Práva užívateľov",
      text: "Máte právo na prístup k svojim údajom, ich úpravu alebo vymazanie. Kontaktujte nás na emailovej adrese support@zoskasnap.sk.",
      icon: "gavel"
    },
    {
      heading: "Bezpečnosť údajov",
      text: "Používame moderné šifrovacie metódy a pravidelne aktualizujeme naše bezpečnostné opatrenia na ochranu vašich údajov.",
      icon: "shield"
    },
    {
      heading: "Cookies",
      text: "Naša aplikácia používa cookies na zlepšenie používateľského zážitku. Môžete ich vždy odmietnuť v nastaveniach prehliadača.",
      icon: "cookie"
    }
  ],
  footer: "Viac informácií nájdete v našich Podmienkach používania.",
  contactEmail: "support@zoskasnap.sk"
};

export default gdprContent;


