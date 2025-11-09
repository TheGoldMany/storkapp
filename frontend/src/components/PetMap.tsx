import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography, Chip, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { lostPetAPI, foundPetAPI } from '../services/api'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const lostIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const reunitedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Pet {
  id: string
  name?: string
  type: string
  status: string
  latitude?: number
  longitude?: number
  lastSeenLocation?: string
  foundLocation?: string
  lastSeenDate?: string
  foundDate?: string
}

const PetMap: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [lostPets, setLostPets] = useState<Pet[]>([])
  const [foundPets, setFoundPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  // Default center: Budapest, Hungary
  const defaultCenter: [number, number] = [47.4979, 19.0402]

  useEffect(() => {
    fetchMapData()
  }, [])

  const fetchMapData = async () => {
    try {
      setLoading(true)
      const [lostResponse, foundResponse] = await Promise.all([
        lostPetAPI.getLostPets({ limit: 100 }),
        foundPetAPI.getFoundPets({ limit: 100 })
      ])

      setLostPets(lostResponse.data.data.lostPets || [])
      setFoundPets(foundResponse.data.data.foundPets || [])
    } catch (error) {
      console.error('Failed to fetch map data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMarkerIcon = (pet: Pet, isLost: boolean) => {
    if (pet.status === 'REUNITED') return reunitedIcon
    return isLost ? lostIcon : foundIcon
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('hu-HU')
  }

  if (loading) {
    return (
      <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <MapContainer
        center={defaultCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Lost Pets Markers */}
        {lostPets.map((pet) => {
          if (!pet.latitude || !pet.longitude) return null
          return (
            <Marker
              key={`lost-${pet.id}`}
              position={[pet.latitude, pet.longitude]}
              icon={getMarkerIcon(pet, true)}
            >
              <Popup>
                <Box sx={{ p: 1, minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    {pet.name || t('lostPets.title')}
                  </Typography>
                  <Chip
                    label={pet.status === 'REUNITED' ? t('map.reunited') : t('map.lost')}
                    color={pet.status === 'REUNITED' ? 'success' : 'error'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('animals.type')}: {t(`animals.types.${pet.type}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('map.lastSeen')}: {formatDate(pet.lastSeenDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {pet.lastSeenLocation}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/lost-pets/${pet.id}`)}
                  >
                    {t('map.viewDetails')}
                  </Button>
                </Box>
              </Popup>
            </Marker>
          )
        })}

        {/* Found Pets Markers */}
        {foundPets.map((pet) => {
          if (!pet.latitude || !pet.longitude) return null
          return (
            <Marker
              key={`found-${pet.id}`}
              position={[pet.latitude, pet.longitude]}
              icon={getMarkerIcon(pet, false)}
            >
              <Popup>
                <Box sx={{ p: 1, minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('foundPets.title')}
                  </Typography>
                  <Chip
                    label={pet.status === 'REUNITED' ? t('map.reunited') : t('map.found')}
                    color={pet.status === 'REUNITED' ? 'success' : 'info'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('animals.type')}: {t(`animals.types.${pet.type}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('map.foundOn')}: {formatDate(pet.foundDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {pet.foundLocation}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/found-pets/${pet.id}`)}
                  >
                    {t('map.viewDetails')}
                  </Button>
                </Box>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </Box>
  )
}

export default PetMap
