import React from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PetsIcon from '@mui/icons-material/Pets'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HomeIcon from '@mui/icons-material/Home'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'

const TipsPage = () => {
  const tipsCategories = [
    {
      icon: <HomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'ElsQ napok otthon',
      color: 'primary.light',
      tips: [
        {
          question: 'Hogyan készítsem fel az otthonomat az új háziállat érkezésére?',
          answer:
            'Készítsd elQ a helyet elQre: ágy, tálak, játékok. Távolíts el minden veszélyes tárgyat és növényt. Biztosíts csendes, biztonságos helyet pihenésre. Az elsQ napokban adj neki idQt alkalmazkodni.',
        },
        {
          question: 'Mennyi idQre van szükség az alkalmazkodáshoz?',
          answer:
            'Általában 2-4 hétre van szükség, de ez állatonként változhat. Légy türelmes és következetes. Az elsQ napokban normális, ha félénk vagy túlaktív.',
        },
      ],
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Táplálkozás',
      color: 'error.light',
      tips: [
        {
          question: 'Mivel etessem az új háziállatot?',
          answer:
            'Az elsQ hetekben használd ugyanazt az ételt, amit a menhelyen kapott, fokozatosan válts át új étrendre. Mindig legyen friss víz elérhetQ. Kérd ki az állatorvos tanácsát a megfelelQ táplálásról.',
        },
        {
          question: 'Milyen gyakran etessek?',
          answer:
            'Kutyák: napi 2-3 alkalommal. Macskák: napi 2-4 kisebb adag. Kölykök: gyakrabban, 3-4 alkalommal. Tartsd be az adagolási útmutatót a túletetés elkerülése érdekében.',
        },
      ],
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Egészségügy',
      color: 'success.light',
      tips: [
        {
          question: 'Milyen oltásokra van szükség?',
          answer:
            'Kutyák: veszettség, kombinált oltás (kiütéses distemper, parvo, hepatitis). Macskák: veszettség, macska-influenza, panleukopenia. Az oltási tervet állatorvossal egyeztess.',
        },
        {
          question: 'Mikor vigyem állatorvoshoz?',
          answer:
            'ElsQ vizit: 1-2 héten belül az örökbefogadás után általános ellenQrzésre. Rendszeres: évente 1-2 alkalom. Azonnal: ha bármilyen szokatlan tünetet észlelsz (hányás, hasmenés, étvágytalanság, letargia).',
        },
        {
          question: 'Fontos-e a parazitaellenes kezelés?',
          answer:
            'Igen, nagyon fontos! KülsQ paraziták (bolha, kullancs): havi rendszerességgel. BelsQ paraziták (férgek): 3-6 havonta. Kérd ki az állatorvos tanácsát a megfelelQ készítményrQl.',
        },
      ],
    },
    {
      icon: <PetsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Nevelés és viselkedés',
      color: 'warning.light',
      tips: [
        {
          question: 'Hogyan szoktassam hozzá a szabályokhoz?',
          answer:
            'Légy következetes minden családtaggal. Használj pozitív megerQsítést (jutalmazás helyes viselkedésért). Soha ne használj fizikai büntetést. Kezdd azonnal, ne halaszd késQbbre.',
        },
        {
          question: 'Mit tegyek, ha viselkedési problémák jelentkeznek?',
          answer:
            'ElQször próbáld megérteni az okot. Biztosíts elég mozgást és szellemi stimulációt. Fordulj viselkedés-specialistához vagy trénerhez súlyosabb problémák esetén. Légy türelmes, a változás idQt igényel.',
        },
        {
          question: 'Mennyire fontos a szocializáció?',
          answer:
            'Rendkívül fontos, fQleg kölyköknél! Ismertesd meg más állatokkal, emberekkel, környezetekkel. Óvatos, fokozatos bemutatás. Pozitív élmények társítása új helyzetekhez.',
        },
      ],
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Hasznos tanácsok
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Minden, amit tudnod kell az új háziállat gondozásáról és nevelésérQl
        </Typography>
      </Box>

      {/* Quick Tips Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tipsCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                bgcolor: category.color,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{category.icon}</Box>
                <Typography variant="h6">{category.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Tips */}
      {tipsCategories.map((category, categoryIndex) => (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }} key={categoryIndex}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {category.icon}
            <Typography variant="h5" sx={{ ml: 2 }}>
              {category.title}
            </Typography>
          </Box>
          {category.tips.map((tip, tipIndex) => (
            <Accordion key={tipIndex}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {tip.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {tip.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      ))}

      {/* Additional Resources */}
      <Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: 'info.light' }}>
        <Typography variant="h5" gutterBottom>
          További hasznos információk
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Fontos telefonszámok
            </Typography>
            <Typography variant="body2" paragraph>
              " Állatorvosi ügyelet: 112 (általános segélyhívó)
              <br />
              " ÁllatvédQ Liga: +36 1 208 0571
              <br />
              " Ebkutató: +36 1 333 7274
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Hasznos weboldalak
            </Typography>
            <Typography variant="body2" paragraph>
              " Magyar ÁllatvédQk Szövetsége
              <br />
              " Orpheus ÁllatvédQ Egyesület
              <br />
              " Noah Állatotthon Alapítvány
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default TipsPage
