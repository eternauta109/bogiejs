/* eslint-disable react/prop-types */

import { Card, CardContent, Typography } from '@mui/material'

const CustomCard = ({ title, description }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography>{description}</Typography>
      </CardContent>
    </Card>
  )
}

export default CustomCard
