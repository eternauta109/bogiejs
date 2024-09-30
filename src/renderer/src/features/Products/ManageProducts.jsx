// src/components/ManageProducts.jsx
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import {
  Container,
  Box,
  Snackbar,
  Alert,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB
} from '../../store/reducers/products'

const ManageProducts = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // Stato per il messaggio di errore
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  // Colonne del DataGrid
  const columns = [
    { field: 'codice', headerName: 'Codice', width: 150 },
    { field: 'nomeProdotto', headerName: 'Nome Prodotto', width: 200 },
    { field: 'prezzoVendita', headerName: 'Prezzo di Vendita', width: 150, type: 'number' },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Modifica
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.idProduct)}
          >
            Elimina
          </Button>
        </Box>
      )
    }
  ]

  // Funzione per gestire l'aggiunta di un nuovo prodotto
  const handleAdd = () => {
    setSelectedProduct({ codice: '', nomeProdotto: '', prezzoVendita: '' })
    setOpenDialog(true)
  }

  // Funzione per gestire la modifica di un prodotto
  const handleEdit = (product) => {
    setSelectedProduct(product)
    setOpenDialog(true)
  }

  // Funzione per eliminare un prodotto
  const handleDelete = (id) => {
    dispatch(deleteProductFromDB(id))
  }

  // Funzione per chiudere il dialog
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedProduct(null)
  }

  // Funzione per salvare il prodotto (aggiunta o modifica)
  const handleSaveProduct = () => {
    // Controlla se esiste già un prodotto con lo stesso codice
    const existingProduct = products.find(
      (product) =>
        product.codice === selectedProduct.codice && selectedProduct.idProduct === undefined
    )

    if (existingProduct) {
      // Mostra un messaggio di errore se il codice è già presente
      setErrorMessage(
        `Il codice prodotto "${selectedProduct.codice}" è già in uso. Si prega di inserire un codice diverso.`
      )
      setSnackbarOpen(true)
      return
    }

    if (selectedProduct.idProduct) {
      console.log('sto facendo update prodotto')
      dispatch(updateProductInDB(selectedProduct))
    } else {
      console.log('aggiungo prodotto')
      dispatch(
        addProductToDB({
          ...selectedProduct,

          idProduct: 'prod-' + uuidv4()
        })
      )
    }

    handleCloseDialog()
  }

  // Gestisci la chiusura dello Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  useEffect(() => {
    console.log('useeffect MAnageProd.:', products)
    // Recupera i prodotti quando il componente si monta
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Gestione Prodotti
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Aggiungi Prodotto
        </Button>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={products ? products : ''}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={loading}
          disableSelectionOnClick
          getRowId={(row) => row.codice}
        />
      </Box>

      {/* Dialog per aggiungere/modificare prodotto */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct?.id ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Codice"
            type="text"
            fullWidth
            value={selectedProduct?.codice || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, codice: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nome Prodotto"
            type="text"
            fullWidth
            value={selectedProduct?.nomeProdotto || ''}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, nomeProdotto: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Prezzo di Vendita"
            type="number"
            fullWidth
            value={selectedProduct?.prezzoVendita || ''}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, prezzoVendita: parseFloat(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar per mostrare messaggi di errore */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ManageProducts
