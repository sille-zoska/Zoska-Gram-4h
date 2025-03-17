// src/views/public/AboutView.tsx


"use client";

import { useTheme } from "@mui/material/styles";

// MUI imports
import { Container, Typography, Grid, Box } from "@mui/material";
import Image from "next/image";

// Custom imports
import CustomLink from "@/components/CustomLink";



export default function AboutView() {
  const theme = useTheme();

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        O ZoskaGram
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Najdivokejšia platforma (nielen) pre študentov Zošky!
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        ZoskaGram, známy tiež ako ZoškaSnap, je výtvorom nás – mladých, 
        nespútaných a večne usmievavých devätnásťročných študentov 
        zo Spojenej školy na Zochovej 9 v Bratislave. 
        Ako hovoríme my: „Žijeme život naplno a chceme to ukázať celému svetu!“ 
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        Táto platforma vznikla, aby sme si mohli všetci bez hanby 
        a s extra porciou zábavy zdieľať tie najlepšie momenty zo školského 
        (a občas aj mimovyučovacieho) života. Vďaka ZoskaGramu sa spojíme, 
        zoznámime, budeme preberať najnovšie školské drámy a vytvárať spomienky, 
        ktoré sú (spoiler alert) väčšinou fotené z útrpne zábavných uhlov. 
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        Prečo sa pridať? No, ZoskaGram je stvorený na spontánne nápady, 
        fotky z nočného učenia (ktoré sa nikto neučí, ale všetci fotia), 
        zdieľanie momentov z plesu, tréningov, výletov či len obyčajných 
        chvíľ v škole. Výhodou je, že ste medzi svojimi, a tak sa nebudete báť 
        ani tých fotiek, čo ste spravili v jedálni, kým ste sa tvárili, že jete zeleninu. 
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/about1.png"
            alt="ZoskaGram momentka 1"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/about2.png"
            alt="ZoskaGram momentka 2"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/about3.png"
            alt="ZoskaGram momentka 3"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
      </Grid>

      <Typography variant="body1" align="center" gutterBottom sx={{ mt: 4 }}>
        ZoskaGram nie je len appka, je to náš (a vlastne aj váš) 
        priestor pre pestrofarebné zážitky – a to od každodenných 
        až po veľké akcie. Sme mladí, divokí a slobodní, tak prečo to neosláviť 
        aspoň 100 fotkami denne?
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        Tak neváhajte, pridajte sa k našej ZoskaGrame komunite, 
        ktorá si nepotrpí na dokonalosť (ale o to viac na zábavu). 
        Tešíme sa na vaše šialené nápady, fotky z vtipných situácií 
        a – no, vlastne na všetko, čo robí život študenta na Zoške tak výnimočným. 
        Vitajte v našej rodine na Zochovej 9!
      </Typography>
    </Container>
  );
}
