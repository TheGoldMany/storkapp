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
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PetsIcon from '@mui/icons-material/Pets'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HomeIcon from '@mui/icons-material/Home'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import { useTranslation } from 'react-i18next'

const TipsPage = () => {
  const { t } = useTranslation()

  const tipsCategories = [
    {
      icon: <HomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: t('tips.categories.firstDays.title'),
      color: 'primary.light',
      tips: [
        {
          question: t('tips.categories.firstDays.q1'),
          answer: t('tips.categories.firstDays.a1'),
        },
        {
          question: t('tips.categories.firstDays.q2'),
          answer: t('tips.categories.firstDays.a2'),
        },
      ],
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: t('tips.categories.nutrition.title'),
      color: 'error.light',
      tips: [
        {
          question: t('tips.categories.nutrition.q1'),
          answer: t('tips.categories.nutrition.a1'),
        },
        {
          question: t('tips.categories.nutrition.q2'),
          answer: t('tips.categories.nutrition.a2'),
        },
      ],
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: t('tips.categories.health.title'),
      color: 'success.light',
      tips: [
        {
          question: t('tips.categories.health.q1'),
          answer: t('tips.categories.health.a1'),
        },
        {
          question: t('tips.categories.health.q2'),
          answer: t('tips.categories.health.a2'),
        },
        {
          question: t('tips.categories.health.q3'),
          answer: t('tips.categories.health.a3'),
        },
      ],
    },
    {
      icon: <PetsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: t('tips.categories.training.title'),
      color: 'warning.light',
      tips: [
        {
          question: t('tips.categories.training.q1'),
          answer: t('tips.categories.training.a1'),
        },
        {
          question: t('tips.categories.training.q2'),
          answer: t('tips.categories.training.a2'),
        },
        {
          question: t('tips.categories.training.q3'),
          answer: t('tips.categories.training.a3'),
        },
      ],
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          {t('tips.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('tips.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {tipsCategories.map((category, categoryIndex) => (
          <Grid item xs={12} md={6} key={categoryIndex}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      bgcolor: category.color,
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h5" component="h2">
                    {category.title}
                  </Typography>
                </Box>

                {category.tips.map((tip, tipIndex) => (
                  <Accordion key={tipIndex} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {tip.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {tip.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default TipsPage
