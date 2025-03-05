// src/content/termsContent.ts

// TypeScript interfaces
interface Section {
  heading: string;
  text: string;
}

interface TermsContent {
  title: string;
  introduction: string;
  sections: Section[];
  footer: string;
}

// Content definition
const termsContent: TermsContent = {
  title: "Podmienky používania",
  introduction:
    "Tieto podmienky upravujú používanie aplikácie ZoškaSnap. Pred použitím našej aplikácie si prosím dôkladne prečítajte tieto podmienky.",
  sections: [
    {
      heading: "Používanie aplikácie",
      text: "Užívateľ sa zaväzuje používať aplikáciu v súlade so zákonmi a dobrými mravmi.",
    },
    {
      heading: "Ochrana údajov",
      text: "Vaše údaje sú spracovávané v súlade s našimi zásadami ochrany osobných údajov.",
    },
  ],
  footer: "Ďakujeme, že dodržiavate podmienky používania našej aplikácie.",
};

export default termsContent;
