// src/content/aboutContent.ts

// TypeScript interfaces
interface Link {
  label: string;
  url: string;
}

interface AboutContent {
  title: string;
  introduction: string;
  links: Link[];
}

// Content definition
const aboutContent: AboutContent = {
  title: "O nás",
  introduction:
    "Vitajte na stránkach ZoškaSnap! Sme hrdí na našu školu a komunitu na SPŠE Zochova 9 v Bratislave.",
  links: [
    { label: "Naša škola", url: "https://zochova.sk/" },
    { label: "Facebook", url: "https://www.facebook.com/spsezochova/" },
    { label: "Instagram", url: "https://www.instagram.com/spsezochova/" },
  ],
};

export default aboutContent;
