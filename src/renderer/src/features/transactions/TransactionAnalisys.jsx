// src/components/TransactionsList.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DataGrid } from '@mui/x-data-grid'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { fetchTransactions } from '../../store/reducers/transactions'

const TransactionsList = () => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.transactions)
  const loading = useSelector((state) => state.transactions.loading)
  const error = useSelector((state) => state.transactions.error)
  const [groupedTransactions, setGroupedTransactions] = useState({})
  const [groupedView, setGroupedView] = useState(false)
  console.log('sempre trans', transactions)
  useEffect(() => {
    dispatch(fetchTransactions())
    console.log('transactions', transactions)
  }, [dispatch])

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const groupByTransactionId = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.transactionId]) {
          acc[transaction.transactionId] = []
        }
        acc[transaction.transactionId].push(transaction)
        return acc
      }, {})

      setGroupedTransactions(groupByTransactionId)
    }
  }, [transactions])

  const calculateGroupTotal = (transactionGroup) => {
    return transactionGroup.reduce((acc, item) => acc + item.prezzo, 0).toFixed(2)
  }

  const columns = [
    { field: 'transactionId', headerName: 'ID Transazione', width: 150 },
    { field: 'supplyName', headerName: 'Prodotto', width: 200 },
    { field: 'prezzo', headerName: 'Prezzo (€)', width: 120, type: 'number' },
    { field: 'user', headerName: 'Utente', width: 150 },
    { field: 'paymentType', headerName: 'Tipo Pagamento', width: 150 },
    { field: 'FEATURE', headerName: 'Spettacolo', width: 200 },
    { field: 'FEATURE_TIME', headerName: 'Orario Spettacolo', width: 150 },
    { field: 'attendance', headerName: 'Presenze', width: 100, type: 'number' },
    { field: 'transactionDate', headerName: 'Data Transazione', width: 200 }
  ]

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Transazioni')

    // Definizione intestazioni colonne con formattazione
    worksheet.columns = [
      { header: 'ID Transazione', key: 'transactionId', width: 25 },
      { header: 'Utente', key: 'user', width: 20 },
      { header: 'Prodotto', key: 'supplyName', width: 30 },
      { header: 'Prezzo (€)', key: 'prezzo', width: 15 },
      { header: 'Tipo Pagamento', key: 'paymentType', width: 20 },
      { header: 'Spettacolo', key: 'FEATURE', width: 30 },
      { header: 'Orario Spettacolo', key: 'FEATURE_TIME', width: 20 },
      { header: 'Presenze', key: 'attendance', width: 15 },
      { header: 'Data Transazione', key: 'transactionDate', width: 25 }
    ]

    // Aggiungi le righe dei dati
    transactions.forEach((transaction) => {
      worksheet.addRow(transaction)
    })

    // Applicazione formattazione alle intestazioni
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).alignment = { horizontal: 'center' }
    worksheet.columns.forEach((column) => {
      column.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    // Impostazione dei bordi
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
    })

    // Salva il file Excel
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), 'Transazioni.xlsx')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Lista delle Transazioni
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Switch checked={groupedView} onChange={(e) => setGroupedView(e.target.checked)} />
            }
            label="Raggruppa per Transazione"
          />
          <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ ml: 2 }}>
            Esporta in Excel
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Typography>Caricamento delle transazioni...</Typography>
      ) : error ? (
        <Typography color="error">Errore: {error}</Typography>
      ) : groupedView ? (
        <Box>
          {Object.entries(groupedTransactions).map(([transactionId, transactionGroup]) => (
            <Accordion key={transactionId} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">ID Transazione: {transactionId}</Typography>
                <Typography variant="body2" sx={{ marginLeft: 2 }}>
                  Utente: {transactionGroup[0].user} | Data: {transactionGroup[0].transactionDate} |
                  Totale: €{calculateGroupTotal(transactionGroup)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ height: 300, width: '100%' }}>
                  <DataGrid
                    rows={transactionGroup ? transactionGroup : ''}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    getRowId={(row) => row.salesId}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={transactions ? transactions : ''}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            getRowId={(row) => row.salesId}
          />
        </Box>
      )}
    </Container>
  )
}

export default TransactionsList
