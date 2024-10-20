// src/components/Supplies.jsx
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DataGrid } from '@mui/x-data-grid'
import {
  Container,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Alert
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../store/reducers/products'
import {
  fetchSupplies,
  addSupplyToDB,
  updateSupplyInDB,
  deleteSupplyFromDB
} from '../../store/reducers/supplies'

const Supplies = () => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.products)
  const supplies = useSelector((state) => state.supplies.supplies)
  const loading = useSelector((state) => state.supplies.loading)
  const error = useSelector((state) => state.supplies.error)

  const [newSupply, setNewSupply] = useState({
    supplyName: '',
    initialQuantity: '',
    remainingQuantity: '',
    category: ''
  })
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [editing, setEditing] = useState(false) // Stato per indicare se stiamo modificando

  // Colonne del DataGrid
  const columns = [
    {
      field: 'supplyName',
      headerName: 'Prodotto',
      width: 200
    },
    {
      field: 'initialQuantity',
      headerName: 'Quantità Iniziale',
      width: 150,
      type: 'number'
    },
    {
      field: 'remainingQuantity',
      headerName: 'Quantità Rimanente',
      width: 150,
      type: 'number'
    },
    {
      field: 'tab',
      headerName: 'pagina di vendita',
      width: 150,
      type: 'number'
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="outlined" color="primary" onClick={() => handleEditSupply(params.row)}>
            Modifica
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDeleteSupply(params.row.supplyId)}
            sx={{ ml: 1 }}
          >
            Cancella
          </Button>
        </>
      )
    }
  ]

  // Gestisci i cambiamenti nei campi di input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    if (name === 'supplyName') {
      // Trova il prodotto corrispondente basato sul nome selezionato
      const selectedProduct = products.find((product) => product.nomeProdotto === value)

      if (selectedProduct) {
        // Aggiungi il codice e il nome del prodotto nello stato
        setNewSupply((prevSupply) => ({
          ...prevSupply,
          [name]: value,

          category: selectedProduct.category,
          prezzo: selectedProduct.prezzoVendita,
          codice: selectedProduct.codice // Imposta il codice selezionato
        }))
      }
    } else {
      setNewSupply((prevSupply) => ({
        ...prevSupply,
        [name]: value
      }))
    }
  }

  // Salva la nuova supply o aggiorna l'esistente
  const handleSaveSupply = async () => {
    if (
      newSupply.supplyName === '' ||
      newSupply.initialQuantity === '' ||
      newSupply.tab === undefined
    ) {
      return console.log('campi obligatori', newSupply.tab)
    }

    /*   // Controlla se esiste già un prodotto con lo stesso codice
    const existingSupply = supplies.find((supply) => supply.codice === selectedProduct.codice) */

    try {
      if (editing) {
        // Modifica la supply esistente

        await dispatch(updateSupplyInDB(newSupply)).unwrap()
        console.log('Supply aggiornata:', newSupply)
      } else {
        // Aggiungi una nuova supply
        const supplyToSave = {
          ...newSupply,
          supplyId: 'supply-' + uuidv4()
        }
        console.log('supplyToSave:', supplyToSave)
        await dispatch(addSupplyToDB(supplyToSave)).unwrap()
      }

      setNewSupply({ supplyName: '', initialQuantity: '', remainingQuantity: '', category: '' }) // Resetta il form dopo il salvataggio
      setOpenSnackBar(true) // Mostra snackbar di successo
      setEditing(false) // Reset dell'editing
    } catch (error) {
      console.error('Errore durante il salvataggio della supply:', error)
      setOpenSnackBar(true)
    }
  }

  // Imposta la supply per la modifica
  const handleEditSupply = (supply) => {
    console.log('vuoi modficare questo supply:', supply)
    setEditing(true)
    setNewSupply({
      ...supply
    })
  }

  // Cancella la supply
  const handleDeleteSupply = async (supplyId) => {
    try {
      await dispatch(deleteSupplyFromDB(supplyId)).unwrap()
      console.log('Supply eliminata con successo:', supplyId)
      setOpenSnackBar(true) // Mostra snackbar di successo
    } catch (error) {
      console.error('Errore durante l eliminazione della supply:', error)
      setOpenSnackBar(true)
    }
  }

  const closeSnackBar = () => {
    setOpenSnackBar(false)
  }

  useEffect(() => {
    dispatch(fetchProducts())

    return () => {}
  }, [])

  useEffect(() => {
    // Carica i prodotti e le supplies dallo store quando il componente si monta
    console.log('supplies in use effect dispatch', supplies)
    dispatch(fetchSupplies())
  }, [dispatch])

  useEffect(() => {
    // Carica i prodotti e le supplies dallo store quando il componente si monta
    console.log('supplies in use effect lenght', supplies)
  }, [supplies])

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Rifonisci YumTrek
        </Typography>
        {/* <Button variant="contained" onClick={handleSaveSupply} disabled={loading}>
          {editing ? 'Aggiorna Prodotto' : 'Salva Prodotto'}
        </Button> */}
      </Box>

      {/* Griglia delle supplies esistenti */}
      <Box sx={{ height: 400, width: '100%', mb: 4 }}>
        <DataGrid
          rows={supplies ? supplies : []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.codice}
        />
      </Box>

      {/* Form per aggiungere/modificare una supply */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Select
          value={newSupply?.supplyName || ''}
          name="supplyName"
          required
          disabled={editing}
          onChange={handleInputChange}
          displayEmpty
          sx={{ width: 200 }}
        >
          <MenuItem value="" disabled>
            Seleziona un prodotto
          </MenuItem>
          {products
            .filter(
              (product) =>
                !supplies.some(
                  (supply) =>
                    supply.supplyName === product.nomeProdotto &&
                    (!editing || supply.supplyId !== newSupply.supplyId)
                )
            )
            .map((product) => (
              <MenuItem key={product.idProduct} value={product.nomeProdotto}>
                {product.nomeProdotto}
              </MenuItem>
            ))}
          {/* {products.map((product) => (
            <MenuItem key={product.idProduct} value={product.nomeProdotto}>
              {product.nomeProdotto}
            </MenuItem>
          ))} */}
        </Select>

        <TextField
          label="Quantità Iniziale"
          name="initialQuantity"
          type="number"
          required
          value={newSupply.initialQuantity}
          onChange={handleInputChange}
        />
        {/* tab */}
        <Select
          value={newSupply?.tab || ''}
          name="tab"
          required
          onChange={handleInputChange}
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

        <Button variant="contained" color="primary" onClick={handleSaveSupply} disabled={loading}>
          {editing ? 'Aggiorna' : 'Aggiungi'}
        </Button>
      </Box>

      {/* Snackbar di notifica */}
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={closeSnackBar}>
        <Alert
          onClose={closeSnackBar}
          severity={error ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error
            ? `Errore: ${error}`
            : editing
              ? 'Supply aggiornata con successo!'
              : 'Supply aggiunta con successo!'}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Supplies
