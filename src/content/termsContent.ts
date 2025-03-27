// src/content/termsContent.ts

// TypeScript interfaces
interface Section {
  heading: string;
  text: string;
  icon?: string; // Optional icon name for the section
}

interface TermsContent {
  title: string;
  subtitle: string;
  introduction: string;
  sections: Section[];
  footer: string;
  lastUpdated: string;
}

// Content definition
const termsContent: TermsContent = {
  title: "Podmienky používania",
  subtitle: "Pravidlá pre používanie ZoskaGram",
  introduction: "Tieto podmienky upravujú používanie aplikácie ZoskaGram. Pred použitím našej aplikácie si prosím dôkladne prečítajte tieto podmienky.",
  sections: [
    {
      heading: "Používanie aplikácie",
      text: "Užívateľ sa zaväzuje používať aplikáciu v súlade so zákonmi a dobrými mravmi. Nepovolené je zdieľanie nevhodného obsahu, spam alebo škodlivého softvéru.",
      icon: "gavel"
    },
    {
      heading: "Ochrana údajov",
      text: "Vaše údaje sú spracovávané v súlade s našimi zásadami ochrany osobných údajov a GDPR. Zaväzujeme sa k bezpečnému spracovaniu vašich údajov.",
      icon: "security"
    },
    {
      heading: "Duševné vlastníctvo",
      text: "Všetok obsah zdieľaný na platforme musí byť vašim vlastným dielom alebo musíte mať práva na jeho zdieľanie.",
      icon: "copyright"
    },
    {
      heading: "Účet a bezpečnosť",
      text: "Ste zodpovední za bezpečnosť svojho účtu a všetky aktivity vykonané pod vaším účtom.",
      icon: "account_circle"
    }
  ],
  footer: "Ďakujeme, že dodržiavate podmienky používania našej aplikácie. Vaša spolupráca je pre nás dôležitá.",
  lastUpdated: "1. január 2024"
};

export default termsContent;
