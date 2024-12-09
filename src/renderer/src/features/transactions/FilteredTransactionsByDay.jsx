import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { fetchTransactionsByDate } from '../../store/reducers/transactions'

const FilteredTransactionsByDay = () => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.transactions)
  const [selectedDate, setSelectedDate] = useState('')

  const handleDateChange = (e) => {
    const selected = e.target.value
    setSelectedDate(selected)

    if (selected) {
      dispatch(fetchTransactionsByDate(selected))
    }
  }

  const groupedByUser = transactions.reduce((acc, transaction) => {
    const { user, paymentType, supplyName, prezzo } = transaction

    if (!acc[user]) {
      acc[user] = { cash: {}, card: {}, totals: { cash: 0, card: 0 } }
    }

    const paymentGroup = paymentType === 'cash' ? acc[user].cash : acc[user].card
    if (!paymentGroup[supplyName]) {
      paymentGroup[supplyName] = { count: 0, total: 0 }
    }

    paymentGroup[supplyName].count += 1
    paymentGroup[supplyName].total += prezzo
    acc[user].totals[paymentType] += prezzo

    return acc
  }, {})

  const totalSummary = transactions.reduce(
    (acc, { paymentType, supplyName, prezzo }) => {
      const group = paymentType === 'cash' ? acc.cash : acc.card

      if (!group[supplyName]) {
        group[supplyName] = { count: 0, total: 0 }
      }

      group[supplyName].count += 1
      group[supplyName].total += prezzo

      acc.totals[paymentType] += prezzo

      return acc
    },
    { cash: {}, card: {}, totals: { cash: 0, card: 0 } }
  )

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        Scontrino per giorno e utente
      </Typography>

      <TextField
        label="Seleziona una data"
        type="date"
        value={selectedDate || ''}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true
        }}
        sx={{ my: 2 }}
      />

      {selectedDate ? (
        transactions.length > 0 ? (
          <Box>
            {Object.entries(groupedByUser).map(([user, paymentTypes]) => (
              <Box key={user} sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="bold">
                  Utente: {user}
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Pagamenti in contanti:
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Prodotto</TableCell>
                        <TableCell>Quantità</TableCell>
                        <TableCell>Totale (€)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(paymentTypes.cash).map(([productName, details]) => (
                        <TableRow key={productName}>
                          <TableCell>{productName}</TableCell>
                          <TableCell>{details.count}</TableCell>
                          <TableCell>{details.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                          Totale contanti:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          €{paymentTypes.totals.cash.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="subtitle1">Pagamenti con carta:</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Prodotto</TableCell>
                        <TableCell>Quantità</TableCell>
                        <TableCell>Totale (€)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(paymentTypes.card).map(([productName, details]) => (
                        <TableRow key={productName}>
                          <TableCell>{productName}</TableCell>
                          <TableCell>{details.count}</TableCell>
                          <TableCell>{details.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                          Totale carta:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          €{paymentTypes.totals.card.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
              Riepilogo Generale - Contanti:
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Prodotto</TableCell>
                    <TableCell>Quantità</TableCell>
                    <TableCell>Totale (€)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(totalSummary.cash).map(([productName, details]) => (
                    <TableRow key={productName}>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{details.count}</TableCell>
                      <TableCell>{details.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                      Totale Contanti:
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      €{totalSummary.totals.cash.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
              Riepilogo Generale - Carta:
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Prodotto</TableCell>
                    <TableCell>Quantità</TableCell>
                    <TableCell>Totale (€)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(totalSummary.card).map(([productName, details]) => (
                    <TableRow key={productName}>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{details.count}</TableCell>
                      <TableCell>{details.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                      Totale Carta:
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      €{totalSummary.totals.card.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography>Nessuna transazione trovata per la data selezionata.</Typography>
        )
      ) : (
        <Typography>Seleziona una data per visualizzare le transazioni.</Typography>
      )}
    </Box>
  )
}

export default FilteredTransactionsByDay
