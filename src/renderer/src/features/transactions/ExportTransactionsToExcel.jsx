/* eslint-disable react/prop-types */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Button } from '@mui/material'

const ExportTransactionsToExcel = ({ transactions }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Transazioni')

    worksheet.columns = [
      { header: 'ID Transazione', key: 'transactionId', width: 25 },
      { header: 'Utente', key: 'user', width: 20 },
      { header: 'Prodotto', key: 'supplyName', width: 30 },
      { header: 'Categoria', key: 'category', width: 30 },
      { header: 'Prezzo (€)', key: 'prezzo', width: 15 },
      {
        header: 'Data Transazione',
        key: 'transactionDate',
        width: 25,
        style: { numFmt: 'dd/mm/yyyy hh:mm:ss' }
      },
      { header: 'Tipo Pagamento', key: 'paymentType', width: 20 },
      { header: 'Spettacolo', key: 'FEATURE', width: 30 },
      {
        header: 'Orario Show',
        key: 'SHOW_TIME',
        width: 20,
        style: { numFmt: 'dd/mm/yyyy hh:mm:ss' }
      },
      { header: 'Attendance', key: 'attendance', width: 30 }
    ]

    transactions.forEach((transaction) => {
      worksheet.addRow({
        ...transaction,
        transactionDate: new Date(transaction.transactionDate),
        SHOW_TIME: new Date(transaction.SHOW_TIME)
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), 'Transazioni.xlsx')
  }

  return (
    <Button variant="contained" color="primary" onClick={exportToExcel}>
      Esporta in Excel
    </Button>
  )
}

export default ExportTransactionsToExcel
