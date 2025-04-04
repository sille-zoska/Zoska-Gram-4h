// src/content/termsContent.ts

// TypeScript interfaces
interface Section {
  heading: string;
  text: string;
}

interface TermsContent {
  title: string;
  subtitle: string;
  introduction: string;
  sections: Section[];
  footer: string;
  lastUpdated: string;
  contactEmail: string;
}

// Content definition
const termsContent: TermsContent = {
  title: "Podmienky používania služby",
  subtitle: "Zmluvné podmienky pre používanie ZoskaGram",
  introduction: "Tieto podmienky používania upravujú vaše práva a povinnosti pri používaní služby ZoskaGram. Používaním našej služby vyjadrujete súhlas s týmito podmienkami. Prosíme vás o ich dôkladné prečítanie.",
  sections: [
    {
      heading: "Registrácia a účet",
      text: "Pre používanie služby je potrebná registrácia. Zaväzujete sa poskytovať pravdivé a aktuálne informácie, chrániť svoje prihlasovacie údaje a neposkytnúť prístup k účtu tretím osobám. Máte právo kedykoľvek svoj účet zrušiť."
    },
    {
      heading: "Pravidlá používania",
      text: "Zaväzujete sa používať službu v súlade so zákonom a dobrými mravmi. Je zakázané: šíriť nevhodný alebo urážlivý obsah, porušovať práva iných užívateľov, používať automatizované skripty, alebo zneužívať službu na spam či škodlivé účely."
    },
    {
      heading: "Obsah a zodpovednosť",
      text: "Ste plne zodpovední za obsah, ktorý zdieľate. Tento obsah musí rešpektovať autorské práva, ochranné známky a iné práva duševného vlastníctva. Vyhradzujeme si právo odstrániť nevhodný obsah bez predchádzajúceho upozornenia."
    },
    {
      heading: "Ochrana súkromia",
      text: "Spracovanie osobných údajov sa riadi našimi Zásadami ochrany osobných údajov v súlade s GDPR. Používaním služby súhlasíte so spracovaním vašich údajov podľa týchto zásad."
    },
    {
      heading: "Dostupnosť služby",
      text: "Vynakladáme maximálne úsilie na zabezpečenie nepretržitej dostupnosti služby, nemôžeme ju však garantovať. Vyhradzujeme si právo na údržbu, aktualizácie alebo zmeny služby bez predchádzajúceho upozornenia."
    },
    {
      heading: "Ukončenie používania",
      text: "Vyhradzujeme si právo pozastaviť alebo ukončiť poskytovanie služby užívateľom, ktorí porušujú tieto podmienky. V prípade závažného porušenia môže byť účet okamžite zrušený."
    },
    {
      heading: "Zmeny podmienok",
      text: "Tieto podmienky môžeme kedykoľvek zmeniť. O významných zmenách vás budeme informovať. Pokračovaním v používaní služby po zmene podmienok vyjadrujete súhlas s novými podmienkami."
    }
  ],
  footer: "Ak máte akékoľvek otázky týkajúce sa týchto podmienok, neváhajte nás kontaktovať. Vaša spokojnosť a bezpečnosť sú pre nás prioritou.",
  lastUpdated: "15. marec 2024",
  contactEmail: "terms@zoskasnap.sk"
};

export default termsContent;
