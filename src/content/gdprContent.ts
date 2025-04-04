// src/content/gdprContent.ts

// TypeScript interfaces
interface Section {
  heading: string;
  text: string;
}

interface GDPRContent {
  title: string;
  subtitle: string;
  introduction: string;
  sections: Section[];
  footer: string;
  contactEmail: string;
  lastUpdated: string;
}

// Content definition
const gdprContent: GDPRContent = {
  title: "Ochrana osobných údajov (GDPR)",
  subtitle: "Informácie o spracovaní vašich osobných údajov",
  introduction: "V súlade s Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov (GDPR) vám poskytujeme podrobné informácie o tom, ako spracúvame vaše osobné údaje a aké sú vaše práva.",
  sections: [
    {
      heading: "Správca údajov",
      text: "Správcom vašich osobných údajov je ZoskaGram. Všetky vaše údaje sú spracovávané v súlade s platnými právnymi predpismi a s maximálnym dôrazom na bezpečnosť."
    },
    {
      heading: "Účel spracovania",
      text: "Vaše osobné údaje spracúvame na účely: vytvorenia a správy používateľského účtu, poskytovania našich služieb, zlepšovania používateľského zážitku, a v prípade vášho súhlasu aj na marketingové účely."
    },
    {
      heading: "Rozsah údajov",
      text: "Spracovávame len nevyhnutné údaje potrebné na poskytovanie našich služieb: e-mailovú adresu, meno a priezvisko, profilový obrázok (voliteľné) a údaje o vašej aktivite v aplikácii."
    },
    {
      heading: "Doba uchovávania",
      text: "Vaše osobné údaje uchovávame len po dobu nevyhnutnú na splnenie účelu spracovania alebo po dobu vyžadovanú právnymi predpismi. Po ukončení účtu sú vaše údaje bezpečne vymazané."
    },
    {
      heading: "Vaše práva",
      text: "Máte právo na: prístup k údajom, opravu údajov, vymazanie údajov, obmedzenie spracovania, prenosnosť údajov, a právo namietať proti spracovaniu. Tieto práva môžete uplatniť prostredníctvom našej podpory."
    },
    {
      heading: "Bezpečnosť",
      text: "Využívame najmodernejšie technológie na ochranu vašich údajov vrátane šifrovania, firewallov a pravidelných bezpečnostných auditov. Vaše údaje sú uložené na zabezpečených serveroch v EÚ."
    },
    {
      heading: "Cookies a analytika",
      text: "Používame nevyhnutné cookies pre fungovanie aplikácie a analytické nástroje na zlepšenie našich služieb. Analytické cookies môžete kedykoľvek vypnúť v nastaveniach vášho prehliadača."
    }
  ],
  footer: "Pre viac informácií o spracovaní vašich osobných údajov alebo uplatnení vašich práv nás neváhajte kontaktovať.",
  contactEmail: "gdpr@zoskasnap.sk",
  lastUpdated: "15. marec 2024"
};

export default gdprContent;


