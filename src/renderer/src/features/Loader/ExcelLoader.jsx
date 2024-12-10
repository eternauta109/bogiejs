// src/components/ExcelLoader.jsx
import { useState } from 'react'
import ExcelJS from 'exceljs'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Container, Typography, Box, Dialog, DialogTitle } from '@mui/material'
import { useDispatch } from 'react-redux'
import { addSelectedShows } from '../../store/reducers/shows' // Importa l'azione dal tuo store
import { subMinutes, format } from 'date-fns' // Importa le funzioni necessarie da date-fns
import { useNavigate } from 'react-router-dom'

const ExcelLoader = () => {
  const [rows, setRows] = useState([])
  const [selectedShows, setSelectedShows] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Funzione per leggere il file Excel usando ExcelJS
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const workbook = new ExcelJS.Workbook()
      const reader = new FileReader()

      reader.onload = async (e) => {
        const buffer = e.target.result
        await workbook.xlsx.load(buffer)

        const worksheet = workbook.getWorksheet(1) // Ottieni il primo foglio di lavoro
        const jsonData = []

        // Itera sulle righe del foglio di lavoro, saltando la riga dell'intestazione
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            // Converte il valore di FEATURE_TIME in oggetto data e sottrae 10 minuti
            const originalFeatureTime = new Date(row.getCell(5).value)
            const adjustedFeatureTime = subMinutes(originalFeatureTime, 10) // Sottrae 10 minuti

            const rowData = {
              id: rowNumber - 2, // Imposta l'ID per la DataGrid
              AUDITORIUM: row.getCell(1).value,
              SCHEDULED_TIME: row.getCell(2).value,
              SHOW_TIME: row.getCell(3).value,
              FEATURE_TIME: format(adjustedFeatureTime, 'yyyy-MM-dd HH:mm:ss'), // Formatta la data modificata
              CREDITS_TIME: row.getCell(5).value,
              END_TIME: row.getCell(6).value,
              DURATION: row.getCell(7).value,
              PLAYLIST: row.getCell(8).value,
              FEATURE: row.getCell(9).value,
              SHOW_STOPPERS: row.getCell(10).value,
              LOCKED: row.getCell(11).value,
              FEATURE_RATING: row.getCell(12).value
            }
            jsonData.push(rowData)
          }
        })

        console.log('Dati del file Excel:', jsonData)
        setRows(jsonData)
      }

      reader.readAsArrayBuffer(file)
    }
  }

  // Colonne della DataGrid
  const columns = [
    { field: 'AUDITORIUM', headerName: 'Auditorium', width: 150 },

    { field: 'SHOW_TIME', headerName: 'Orario Spettacolo', width: 180 },
    { field: 'PLAYLIST', headerName: 'Playlist', width: 200 },
    { field: 'FEATURE_TIME', headerName: 'Orario Feature (-10 min)', width: 200 },
    { field: 'CREDITS_TIME', headerName: 'Orario Crediti', width: 180 },
    { field: 'END_TIME', headerName: 'Orario Fine', width: 180 },
    { field: 'DURATION', headerName: 'Durata', width: 150 },

    { field: 'FEATURE', headerName: 'Feature', width: 300 },
    { field: 'SHOW_STOPPERS', headerName: 'Show Stoppers', width: 150 },
    { field: 'LOCKED', headerName: 'Locked', width: 150 },
    { field: 'FEATURE_RATING', headerName: 'Feature Rating', width: 150 },
    { field: 'SCHEDULED_TIME', headerName: 'Orario Programmato', width: 180 }
  ]

  // Gestisci la selezione degli spettacoli
  /* const handleSelectionChange = (newSelection) => {
    console.log('qui', newSelection)
    setSelectedShows(newSelection)
  } */

  // Salva gli spettacoli selezionati nello store
  const handleSaveSelectedShows = () => {
    const selectedData = rows.filter((row) => selectedShows.includes(row.id))
    dispatch(addSelectedShows(selectedData)) // Salva i dati nello store
    setShowDialog(true)
    console.log('Spettacoli selezionati caricati nello store:', selectedData)
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Carica i Spettacoli in YumTrek
      </Typography>

      <Box mt={2} mb={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Direzione orizzontale
            justifyContent: 'space-between', // Spaziatura tra i due elementi
            alignItems: 'center', // Allinea verticalmente gli elementi al centro
            mb: 2
          }}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="upload-file"
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveSelectedShows}
            disabled={selectedShows.length === 0}
          >
            Salva Spettacoli Selezionati
          </Button>
        </Box>

        <label htmlFor="upload-file">
          <Button variant="contained" component="span" color="primary">
            Carica File Excel
          </Button>
        </label>
      </Box>
      <div style={{ height: 600, width: '100%', marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => {
            console.log(newSelectionModel), setSelectedShows(newSelectionModel)
          }}
          rowSelectionModel={selectedShows}
        />
      </div>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle> Spettacoli caricati</DialogTitle>
        <Button onClick={() => navigate('/supplies')}>Vuoi caricare lo yum trek?</Button>
      </Dialog>

      {/* Snackbar può essere aggiunto qui per visualizzare messaggi di successo o errore */}
    </Container>
  )
}

export default ExcelLoader
