import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../../store/rootStore';


// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('Le prénom est obligatoire'),
  last_name: Yup.string().required('Le nom est obligatoire'),
  email: Yup.string().email('Adresse email invalide').required('L\'email est requis'),
  phone_number: Yup.string().required('Le numéro de téléphone est obligatoire')
    .min(10, 'Le numéro de téléphone doit comporter 10 caractères')
    .max(10, 'Le numéro de téléphone doit comporter 10 caractères'),
  zip_code: Yup.string().required('Le code postal est obligatoire')
    .min(6, 'Le code postal doit comporter 6 caractères')
    .max(6, 'Le code postal doit comporter 6 caractères'),
})


const CustomerEdit = () => {
  const { rootStore: { customerStore } } = useStore();
  const { getData, updateData } = customerStore;
  const { id } = useParams()

  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      zip_code: "",
    }
  })

  const onSubmit = async (data:any) => {
    try {
     if(id){
      const resData = await updateData(id, data)
      if (resData){
        reset()
        navigate('..')
      }
     }
    } catch (error:any) {
      Object.keys(error?.data).map((e:any) => {
        setError(e, {
          type: 'manual', // Use 'manual' for manually triggered errors
          message: error?.data[e],
        });
      })
    }
  }
  
  const initForm = async () => {
    try {
      if(id){
        const resData = await getData(id)
        reset(resData.data.customer)
      }else{
        navigate(-1)
      }
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Erreur lors de la récupération des données:', error);
    }
  }
  useEffect(() => {
    initForm()
  }, [id])

  
  return (
    <Box sx={{ width: '100%' }}>
    <h4>Ajouter</h4>
  <form onSubmit={handleSubmit(onSubmit)}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={6}>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="first_name"
              label="Prénom"
              variant="filled"
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="last_name"
              label="Nom"
              variant="filled"
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="email"
              label="Email"
              variant="filled"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="phone_number"
              label="Numéro de téléphone"
              variant="filled"
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="zip_code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="zip_code"
              label="Code postal"
              variant="filled"
              error={!!errors.zip_code}
              helperText={errors.zip_code?.message}
            />
          )}
        />
      </Grid>
    </Grid>
    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
      Enregistrer
    </Button>
    <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={() => navigate(-1)}>
      Retour
    </Button>
  </form>
</Box>
  )
}

export default observer(CustomerEdit)