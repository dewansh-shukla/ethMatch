import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
const useStyles = makeStyles({})
function Home() {
  const classes = useStyles()
  return (
    <>
      <Grid container>
        <Grid
          item
          lg={4.5}
          md={4}
          xs={12}
          sx={{
            backgroundColor: 'transparent',
            padding: '20px',
            marginTop: '30px',
            border: '2px solid #F4BEEE',
            borderRadius: '10px',
          }}
        ></Grid>
      </Grid>
    </>
  )
}

export default Home
