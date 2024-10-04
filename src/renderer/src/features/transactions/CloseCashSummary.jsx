/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Button } from '@mui/material'
import { useSelector } from 'react-redux'

const CloseCashSummary = ({ user }) => {
  const { totalCash, totalSales, totalCard } = useSelector((state) => state.sales)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Incasso di {user.userName}
        </Typography>
        <Typography variant="h6">Incasso totale: €{totalSales}</Typography>
        <Typography variant="h6">Incasso contanti: €{totalCash}</Typography>
        <Typography variant="h6">Incasso carta: €{totalCard}</Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Chiudi cassa
        </Button>
      </CardContent>
    </Card>
  )
}

export default CloseCashSummary
