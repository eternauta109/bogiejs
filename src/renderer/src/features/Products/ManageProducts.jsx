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
  MenuItem,
  Select,
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
/* import LoadProducts from './LoadProducts' */

const ManageProducts = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // Stato per il messaggio di errore
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  //valory delle category
  const categoryList = ['food', 'confetionary', 'drink', 'sweeties', 'menu']

  // Colonne del DataGrid
  const columns = [
    { field: 'codice', headerName: 'Codice', width: 150 },
    { field: 'nomeProdotto', headerName: 'Nome Prodotto', width: 200 },
    {
      field: 'prezzoVendita',
      headerName: 'Prezzo di Vendita',
      width: 150,
      type: 'number',
      // Usa renderCell per formattare il valore
      renderCell: (params) => {
        const prezzo = params.value
        const prezzoFormattato = `€${prezzo.toFixed(2)}` // Formatta con 2 decimali e simbolo €
        return <Typography>{prezzoFormattato}</Typography>
      }
    },
    { field: 'category', headerName: 'categoria', width: 150 },
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
    console.log(selectedProduct.category)
    if (!selectedProduct.category) {
      // Mostra un messaggio di errore se il codice è già presente
      setErrorMessage(
        `inserisci anche la categoria. un piccolo sforzo per te, un importante passo per porto`
      )

      setSnackbarOpen(true)
      return
    }

    // Controlla se esiste già un prodotto con lo stesso codice
    const existingProduct = products.find(
      (product) =>
        product.codice === selectedProduct.codice && selectedProduct.idProduct === undefined
    )

    if (existingProduct) {
      // Mostra un messaggio di errore se il codice è già presente
      setErrorMessage(
        `Il codice prodotto "${selectedProduct.codice}" è già in uso. Si prega di avere piu fantasia.`
      )
      setSnackbarOpen(true)
      return
    }

    if (selectedProduct.idProduct) {
      dispatch(
        updateProductInDB({
          ...selectedProduct
        })
      )
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

  //carica i prodotti da un file excel

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
        {/* <LoadProducts /> */}
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
            required
            type="text"
            fullWidth
            value={selectedProduct?.codice || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, codice: e.target.value })}
          />
          <TextField
            margin="dense"
            required
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
            required
            label="Prezzo di Vendita"
            type="number"
            fullWidth
            value={selectedProduct?.prezzoVendita || ''}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                prezzoVendita: parseFloat(parseFloat(e.target.value).toFixed(2)) // Mantieni il valore così com'è durante l'input
              })
            }
          />
          {/* categoria */}
          <Select
            value={selectedProduct?.category || ''}
            name="category"
            required
            onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
            displayEmpty
            sx={{ width: 200 }}
          >
            <MenuItem value="" disabled>
              Seleziona una categoria
            </MenuItem>
            {categoryList.map((cat, key) => (
              <MenuItem key={key} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          {/* tab */}
          <Select
            value={selectedProduct?.tab || ''}
            name="tab"
            required
            onChange={(e) => setSelectedProduct({ ...selectedProduct, tab: e.target.value })}
            displayEmpty
            sx={{ width: 200, ml: 2 }}
          >
            <MenuItem value="" disabled>
              Seleziona la pagina
            </MenuItem>

            {/* Genera automaticamente 4 MenuItem */}
            {Array.from({ length: 4 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                tab {index + 1}
              </MenuItem>
            ))}
          </Select>
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
