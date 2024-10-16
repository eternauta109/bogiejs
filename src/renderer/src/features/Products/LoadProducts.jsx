/* import { useState } from 'react'
import { Button, Typography, Box } from '@mui/material'
import { addProductToDB } from '../../store/reducers/products'
import ExcelJS from 'exceljs'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch } from 'react-redux'

const LoadProducts = () => {
  const dispatch = useDispatch()

  const [fileName, setFileName] = useState('')

  // Funzione per gestire la selezione del file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name) // Imposta il nome del file selezionato
      const arrayBuffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer) // Carica il file Excel

      // Accedi al foglio chiamato "prodotti"
      const worksheet = workbook.getWorksheet('prodotti')
      const productsData = []

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          // Ignora l'intestazione
          const product = {
            codice: row.getCell(1).value,
            nomeProdotto: row.getCell(2).value,
            category: row.getCell(3).value,
            prezzoVendita: parseFloat(row.getCell(4).value), // Assicura che il prezzo sia un numero
            tab: row.getCell(8).value,
            idProduct: 'prod-' + uuidv4()
          }
          console.log(product)
          if (product.codice && product.nomeProdotto && !isNaN(product.prezzoVendita)) {
            // Aggiungi solo prodotti validi
            productsData.push(product)
          }
        }
      })

      // Effettua il dispatch dei prodotti al DB
      if (productsData.length > 0) {
        console.log(productsData)
        for (const product of productsData) {
          await dispatch(addProductToDB(product)) // Dispatch asincrono uno alla volta
        }
      }
    }
  }

  return (
    <Box>
      <Typography variant="h4">Carica il file Excel</Typography>
      <Button variant="contained" component="label" color="primary">
        Seleziona File
        <input type="file" accept=".xlsx" hidden onChange={handleFileUpload} />
      </Button>

      {fileName && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          File selezionato: {fileName}
        </Typography>
      )}
    </Box>
  )
}

export default LoadProducts
 */
