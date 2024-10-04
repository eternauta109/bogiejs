/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const TransactionsDataGrid = ({ transactions, loading, error }) => {
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

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      {loading ? (
        <Typography>Caricamento delle transazioni...</Typography>
      ) : error ? (
        <Typography color="error">Errore: {error}</Typography>
      ) : (
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          getRowId={(row) => row.salesId}
        />
      )}
    </Box>
  )
}

export default TransactionsDataGrid
