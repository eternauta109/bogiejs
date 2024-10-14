/* eslint-disable react/prop-types */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Button } from '@mui/material'
import { format } from 'date-fns'

const ExportTransactionsToCSV = ({ transactions, allTrans, user, selectedDate, setAllTrans }) => {
  const exportToCSV = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Transazioni')

    // Definisci le colonne del CSV
    worksheet.columns = [
      { header: 'cinema', key: 'cinema', width: 25 },
      { header: 'ID Transazione', key: 'transactionId', width: 25 },
      { header: 'Utente', key: 'user', width: 20 },
      { header: 'Prodotto', key: 'supplyName', width: 30 },
      { header: 'Categoria', key: 'category', width: 30 },
      { header: 'Prezzo (€)', key: 'prezzo', width: 15 },
      { header: 'Data Transazione', key: 'transactionDate', width: 25 },
      { header: 'Tipo Pagamento', key: 'paymentType', width: 20 },
      { header: 'Spettacolo', key: 'FEATURE', width: 30 },
      { header: 'Orario Show', key: 'SHOW_TIME', width: 20 },
      { header: 'Attendance', key: 'attendance', width: 30 }
    ]

    // Aggiungi le righe con i dati delle transazioni
    transactions.forEach((transaction) => {
      worksheet.addRow({
        ...transaction,
        transactionDate: new Date(transaction.transactionDate).toLocaleString(),
        SHOW_TIME: new Date(transaction.SHOW_TIME).toLocaleString()
      })
    })

    // Scrivi i dati come CSV
    const csvBuffer = await workbook.csv.writeBuffer()

    // Determina il nome del file in base a allTrans e selectedDate
    let fileName = ''
    if (allTrans) {
      fileName = `transazioni-${user.user.cinema}-all.csv`
      setAllTrans(false)
    } else {
      const formattedDate = format(new Date(selectedDate), 'dd-MM-yyyy')

      fileName = `transazioni-${user.user.cinema}-${formattedDate}.csv`
    }

    // Usa file-saver per salvare il file CSV con il nome corretto
    saveAs(new Blob([csvBuffer], { type: 'text/csv;charset=utf-8;' }), fileName)
  }

  return (
    <Button variant="contained" color="primary" onClick={exportToCSV}>
      Esporta in CSV
    </Button>
  )
}

export default ExportTransactionsToCSV
