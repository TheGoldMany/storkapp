import React, { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { uploadAPI } from '../services/api'

interface ImageUploadProps {
  value: string[] // Array of image URLs
  onChange: (images: string[]) => void
  multiple?: boolean
  maxImages?: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  multiple = false,
  maxImages = 5,
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setError(null)
    setUploading(true)

    try {
      const fileArray = Array.from(files)

      // Check if adding these files would exceed max
      if (value.length + fileArray.length > maxImages) {
        throw new Error(`Maximum ${maxImages} képet tölthetsz fel`)
      }

      // Upload files
      if (multiple && fileArray.length > 1) {
        const response = await uploadAPI.uploadImages(fileArray)
        const newUrls = response.data.data.files.map((f: any) => f.url)
        onChange([...value, ...newUrls])
      } else {
        // Upload single file
        const response = await uploadAPI.uploadImage(fileArray[0])
        const newUrl = response.data.data.url
        onChange(multiple ? [...value, newUrl] : [newUrl])
      }
    } catch (err: any) {
      console.error('Upload failed:', err)
      setError(err.message || 'Kép feltöltése sikertelen')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  const canAddMore = multiple && value.length < maxImages

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Image previews */}
      {value.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {value.map((url, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 150,
                height: 150,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <img
                src={`http://localhost:3000${url}`}
                alt={`Upload ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'error.light' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Upload button */}
      {(value.length === 0 || canAddMore) && (
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload-input"
            type="file"
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="image-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              disabled={uploading}
              fullWidth
            >
              {uploading
                ? 'Feltöltés...'
                : value.length === 0
                ? 'Kép feltöltése'
                : 'További kép hozzáadása'}
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Maximum {maxImages} kép, max 5MB/kép. JPG, PNG, GIF, WebP formátumok.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ImageUpload
