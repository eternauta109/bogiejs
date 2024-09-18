import ExcelJS from 'exceljs'
import { Box, Button } from '@mui/material'

const ExportToExcel = async (data, fileName) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  // Definisci le colonne con intestazioni e chiavi
  worksheet.columns = [
    { header: 'date start', key: 'start', width: 20 },
    { header: 'date end', key: 'end', width: 20 },
    { header: 'title', key: 'title', width: 15 },
    { header: 'tipo', key: 'eventType', width: 15 },
    { header: 'descrizione', key: 'description', width: 15 },
    { header: 'reparto', key: 'division', width: 15 },
    { header: 'link', key: 'link', width: 15 },
    { header: 'note', key: 'note', width: 15 }
  ]

  // Aggiungi righe con dati, anche se i campi sono mancanti
  data.forEach((item) => worksheet.addRow(item))

  // Formatta tutte le celle, anche se non hanno un valore
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Applica la formattazione solo alle prime 8 colonne
      if (colNumber <= 8) {
        if (rowNumber === 1) {
          // Formatta l'intestazione
          cell.font = { bold: true, size: 12 }
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
        } else {
          // Formatta le righe di dati
          cell.alignment = { horizontal: 'left' }
          cell.font = { color: { argb: 'FF0000FF' } } // Colore del testo blu
        }

        // Aggiungi bordi a tutte le celle
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    })
  })
  // Esporta il file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${fileName}.xlsx`
  link.click()
}

// eslint-disable-next-line react/prop-types
const PrintOut = ({ data }) => {
  return (
    <Box
      sx={{
        display: 'flex', // Usa flexbox
        justifyContent: 'center' // Centra il bottone orizzontalmente
      }}
    >
      <Button onClick={() => ExportToExcel(data, 'FormattedData')}>
        Esporta in Excel quello che vedi sul calendario
      </Button>
    </Box>
  )
}

export default PrintOut
