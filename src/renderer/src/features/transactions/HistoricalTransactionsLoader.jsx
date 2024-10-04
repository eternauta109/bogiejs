import { Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { fetchTransactions } from '../../store/reducers/transactions'

const HistoricalTransactionsLoader = () => {
  const dispatch = useDispatch()

  const loadHistoricalTransactions = () => {
    dispatch(fetchTransactions())
  }

  return (
    <Button variant="contained" color="secondary" onClick={loadHistoricalTransactions}>
      Carica Transazioni Storiche
    </Button>
  )
}

export default HistoricalTransactionsLoader
