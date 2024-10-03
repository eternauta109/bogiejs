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
  AccordionDetails,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DataGrid } from '@mui/x-data-grid'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { fetchTransactions } from '../../store/reducers/transactions'
import CloseCashDialog from './CloseCashDialog' // Importa il dialog per il conteggio
import FilteredTransactionsByDay from './FilteredTransactionsByDay' // Nuovo componente

const TransactionsList = () => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.transactions)
  const loading = useSelector((state) => state.transactions.loading)
  const error = useSelector((state) => state.transactions.error)
  const user = useSelector((state) => state.managers.user)
  const { totalCash, totalSales, totalCard } = useSelector((state) => state.sales)
  const [groupedTransactions, setGroupedTransactions] = useState({})
  const [groupedView, setGroupedView] = useState(false)
  const [isCashDialogOpen, setIsCashDialogOpen] = useState(false)

  const openCashDialog = () => setIsCashDialogOpen(true)
  const closeCashDialog = () => setIsCashDialogOpen(false)

  useEffect(() => {
    dispatch(fetchTransactions())
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

  const calculateGroupTotal = (transactionGroup) =>
    transactionGroup.reduce((acc, item) => acc + item.prezzo, 0).toFixed(2)

  const columns = [
    { field: 'transactionId', headerName: 'ID Transazione', width: 150 },
    { field: 'supplyName', headerName: 'Prodotto', width: 200 },
    { field: 'category', headerName: 'categoria', width: 200 },
    { field: 'prezzo', headerName: 'Prezzo (€)', width: 120, type: 'number' },
    { field: 'user', headerName: 'Utente', width: 150 },
    { field: 'paymentType', headerName: 'Tipo Pagamento', width: 150 },
    { field: 'transactionDate', headerName: 'Data Transazione', width: 200 },
    { field: 'FEATURE', headerName: 'Spettacolo', width: 200 },
    { field: 'FEATURE_TIME', headerName: 'Orario intermission', width: 150 },
    { field: 'SHOW_TIME', headerName: 'Inizio Show', width: 150 },
    { field: 'attendance', headerName: 'Presenze', width: 100, type: 'number' }
  ]

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
        header: 'inizio show',
        key: 'SHOW_TIME',
        width: 20,
        style: { numFmt: 'dd/mm/yyyy hh:mm:ss' }
      },
      {
        header: 'Orario inizio intervallo',
        key: 'FEATURE_TIME',
        width: 20,
        style: { numFmt: 'hh:mm:ss' }
      },
      { header: 'Presenze', key: 'attendance', width: 15 }
    ]

    transactions.forEach((transaction) => {
      worksheet.addRow({
        ...transaction,
        transactionDate: new Date(transaction.transactionDate),
        SHOW_TIME: new Date(transaction.SHOW_TIME),
        FEATURE_TIME: new Date(transaction.FEATURE_TIME)
      })
    })

    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).alignment = { horizontal: 'center' }
    worksheet.columns.forEach((column) => {
      column.alignment = { vertical: 'middle', horizontal: 'center' }
    })

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

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), 'Transazioni.xlsx')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Incasso di {user.userName}
              </Typography>
              <Typography variant="h6">Incasso totale: €{totalSales}</Typography>
              <Typography variant="h6">Incasso contanti: €{totalCash}</Typography>
              <Typography variant="h6">Incasso carta: €{totalCard}</Typography>
              <Button onClick={openCashDialog} variant="contained" sx={{ mt: 2 }}>
                Chiudi cassa
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Aggiungi il dialog per il conteggio dei tagli */}
      <CloseCashDialog
        open={isCashDialogOpen}
        handleClose={closeCashDialog}
        totalCash={totalCash}
        dispatch={dispatch}
      />

      {/* Componente per filtrare le transazioni */}
      <FilteredTransactionsByDay />

      <Box>
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
                    Utente: {transactionGroup[0].user} | Data: {transactionGroup[0].transactionDate}{' '}
                    | Totale: €{calculateGroupTotal(transactionGroup)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <DataGrid
                      rows={transactionGroup}
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
              rows={transactions}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
              getRowId={(row) => row.salesId}
            />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default TransactionsList
