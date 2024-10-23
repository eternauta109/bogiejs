/* eslint-disable react/prop-types */

import { Grid, Typography, Paper, Button } from '@mui/material'

const ProductSubList = ({ supply, handleAddToCart, selectedShow, attendance, color }) => {
  return (
    <Grid item xs={6} sm={2}>
      <Paper elevation={10} sx={{ padding: 1, backgroundColor: '#f8f9fa', height: '90%' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleAddToCart(supply)}
          disabled={selectedShow == null || !attendance}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 1,
            backgroundColor: color,
            color: '#fff',
            '&:hover': {
              backgroundColor: '#27ae60'
            },
            height: '100%'
          }}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '0.8rem',
              textAlign: 'center',
              color: '#fff',

              mb: 1
            }}
          >
            {supply.supplyName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            €{parseFloat(supply.prezzo).toFixed(2)}
          </Typography>
        </Button>
      </Paper>
    </Grid>
  )
}

export default ProductSubList
