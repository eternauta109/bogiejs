/* eslint-disable react/prop-types */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Button } from '@mui/material'
import { format } from 'date-fns'

const ExportTransactionsToCSV = ({ transactions, allTrans, user, selectedDate, setAllTrans }) => {
  const exportToCSV = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Transazioni')

    // Funzione per determinare la fascia di spettacolo
    const getShowTimeRange = (showTime) => {
      const hour = showTime.getHours()
      const minute = showTime.getMinutes()

      if (hour >= 14 && (hour < 16 || (hour === 16 && minute <= 30))) return '1° SPT'
      if ((hour === 16 && minute > 30) || hour === 17 || (hour === 18 && minute <= 59))
        return '2° SPT'
      if ((hour === 19 && minute > 0) || hour === 20 || (hour === 21 && minute <= 30))
        return '3° SPT'
      if ((hour === 21 && minute > 30) || hour === 22 || (hour === 23 && minute <= 15))
        return '4° SPT'
      if ((hour === 23 && minute > 15) || hour < 8) return 'ALTRO'
      return 'MATTINEE'
    }

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
      { header: 'Attendance', key: 'attendance', width: 30 },
      { header: 'Fascia Spettacolo', key: 'showTimeRange', width: 20 }
    ]

    // Aggiungi le righe con i dati delle transazioni
    transactions.forEach((transaction) => {
      const dateTrans = new Date(transaction.transactionDate)
      dateTrans.setHours(dateTrans.getHours() - 2)
      const formatedPrice = transaction.prezzo.toFixed(2).replace('.', ',')
      const showTime = new Date(transaction.SHOW_TIME)
      const showTimeRange = getShowTimeRange(showTime) // Determina la fascia di spettacolo

      worksheet.addRow({
        ...transaction,
        prezzo: formatedPrice,
        transactionDate: new Date(transaction.transactionDate).toLocaleString(),
        SHOW_TIME: new Date(transaction.SHOW_TIME).toLocaleString(),
        showTimeRange
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
