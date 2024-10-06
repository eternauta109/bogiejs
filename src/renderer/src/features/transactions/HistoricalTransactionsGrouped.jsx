/* eslint-disable react/prop-types */
import { Box, Typography, Divider, Card, CardContent } from '@mui/material'

// Funzione per raggruppare le transazioni per transactionId
const groupTransactionsByTransactionId = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const { transactionId } = transaction
    if (!groups[transactionId]) {
      groups[transactionId] = []
    }
    groups[transactionId].push(transaction)
    return groups
  }, {})
}

// Funzione per contare i prodotti venduti per tipo
const countProductsBySupplyName = (transactionItems) => {
  return transactionItems.reduce((productCount, item) => {
    if (!productCount[item.supplyName]) {
      productCount[item.supplyName] = { count: 0, prezzo: item.prezzo }
    }
    productCount[item.supplyName].count += 1
    return productCount
  }, {})
}

const HistoricalTransactionsGrouped = ({ transactions }) => {
  const groupedTransactions = groupTransactionsByTransactionId(transactions)

  return (
    <Box>
      {Object.keys(groupedTransactions).map((transactionId) => {
        const transactionItems = groupedTransactions[transactionId]
        const productCounts = countProductsBySupplyName(transactionItems)

        const totalQuantity = Object.values(productCounts).reduce(
          (total, item) => total + item.count,
          0
        )
        const totalAmount = Object.values(productCounts).reduce(
          (total, item) => total + item.count * item.prezzo,
          0
        )

        return (
          <Card key={transactionId} sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Transazione ID: {transactionId}
              </Typography>
              <Box sx={{ ml: 2 }}>
                {Object.keys(productCounts).map((productName, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>
                      {productName} (x{productCounts[productName].count})
                    </Typography>
                    <Typography>{productCounts[productName].prezzo.toFixed(2)} €</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight="bold">Totale pezzi venduti: {totalQuantity}</Typography>
                <Typography fontWeight="bold">
                  Totale transazione: {totalAmount.toFixed(2)} €
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}

export default HistoricalTransactionsGrouped
