import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Box, Grid,Button, TextField, } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../../store/rootStore';
import AllItemList from './allItemsList';
import { useReactToPrint } from 'react-to-print';


const OrderView: React.FC<any> = () => {
  const { rootStore: { orderStore } } = useStore();
  const [editData, setEditData] = useState<any>(null)
  
  const navigate = useNavigate()
  const { id } = useParams()

  const printRef = useRef<any>();


  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const fetchDetails = async () => {
    try {
      if(id){
        const resData = await orderStore.getData(id)
        console.log(resData)
        setEditData(resData)
      }else{
        navigate(-1)
      }
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Erreur lors de la récupération des données :', error);
    }
  }
  useEffect(() => {
    orderStore.setCartItems([])
    fetchDetails()

    return () => {
      orderStore.setCartItems([])
    }
  }, [id]);

  return (
    <Box sx={{ width: '100%' }}>
        <Box sx={{ px: 5,  py: 3  }} ref={printRef}>
          <h4>Détails de la Commande</h4>
          
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mb: 2}}>
            <Grid item xs={6}>
            <TextField
              label="ID de la Commande" 
              variant="standard" 
              value={editData?.order_number}
              focused
              fullWidth  
              InputProps={{
                readOnly: true,
              }}
                />
            </Grid>
            <Grid item xs={6}>
            <TextField
              label="Date de la Commande" 
              variant="standard" 
              value={editData?.created_at}
              focused
              fullWidth  
              InputProps={{
                readOnly: true,
              }}
                />
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mb: 2}}>
            <Grid item xs={3}>
            <TextField
              label="Nom du Client" 
              variant="standard" 
              value={editData?.customer?.first_name +" "+editData?.customer?.last_name}
              focused
              fullWidth  
              InputProps={{
                readOnly: true,
              }}
                />
            </Grid>
            <Grid item xs={3}>
            <TextField
              label="Email du Client" 
              variant="standard" 
              value={editData?.customer.email}
              focused
              fullWidth  
              InputProps={{
                readOnly: true,
              }}
                />
            </Grid>
            <Grid item xs={3}>
            <TextField
              label="Téléphone du Client" 
              variant="standard" 
              value={editData?.customer.phone_number}
              focused
              fullWidth  
              InputProps={{
                readOnly: true,
              }}
                />
            </Grid>
            <Grid item xs={3}>
            <TextField
              label="Code Postal du Client" 
              variant="standard" 
              value={editData?.customer.zip_code}
              focused
              fullWidth  
              InputProps={{
                readOnly: true,
              }}
                />
            </Grid>
          </Grid>
          
          <AllItemList editMode={false} />
        </Box>
      <Button sx={{ mt: 2 , ml: 5}} type="button" variant="contained" color="success" onClick={handlePrint}>
        Imprimer
      </Button>
      <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={() => navigate(-1)}>
        Retour
      </Button>
  </Box>
  )
}

export default observer(OrderView)