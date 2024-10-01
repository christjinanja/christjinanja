import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, TextField, Button, CardMedia, Card, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../store/rootStore';
import ServerSideAutocomplete from '../../../components/ui/ServerSideAutocomplete/ServerSideAutocomplete';
import AddNewItemForm from './addNewItemForm';
import AllItemsList from './allItemsList';


// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    id: Yup.string().required('Le client est requis'),
    label: Yup.string().required('Le client est requis'),
  }).required('Le client est requis')
})

const OrderCreate = () => {
  const { rootStore: { orderStore, customerStore } } = useStore();
  const navigate = useNavigate()
  const hookFromObj = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: {id: "", label: ""},
    }
  })

  const { control, handleSubmit, formState: { errors }, reset, setError} = hookFromObj
  const [productsErrorMessage, setProductsErrorMessage] = useState<any>(null);

  const onSubmit = async (data:any) => {
    try {
      setProductsErrorMessage(null);
      const resData = await orderStore.createData(data)
      if (resData){
        reset({
          customer: {id: "", label: ""},
        })
        orderStore.setCartItems([]);
        navigate('..')
      }
    } catch (error:any) {
      Object.keys(error?.data).map((e:any) => {
        setError(e, {
          type: 'manual', // Use 'manual' for manually triggered errors
          message: error?.data[e],
        });
      })
      setProductsErrorMessage("Veuillez sélectionner au moins un produit.");
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
    <h4>Créer une commande</h4>
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Controller
            name="customer"
            control={control}
            render={({ field }) => (
              <ServerSideAutocomplete
                label="Sélectionner un client"
                ajaxCallFn={customerStore.getList} 
                onOptionSelect={(option) => field.onChange(option)}
                error={errors.customer?.id ?? errors.customer}
                field={field}
              />
            )}
          />
        </Grid>
      </Grid>
      </form>
      {/* Add new item form */}
      <AddNewItemForm />
      {productsErrorMessage ?  <Box sx={{ color: 'error.main', my: 2 }}>{productsErrorMessage}</Box>: ""}
      <AllItemsList editMode={true} />

      <Button sx={{ mt: 2 }} type="button" variant="contained" color="success" onClick={() => handleSubmit(onSubmit)()}>
        Sauvegarder
      </Button>
      <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={() => navigate(-1)}>
        Retour
      </Button>
  </Box>
  )
}

export default observer(OrderCreate)