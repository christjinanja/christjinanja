import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, TextField, Button, CardMedia, Card, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../store/rootStore';


// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Le nom du produit est requis'),
  category_id: Yup.string().required('La catégorie est requise'),
  price: Yup.number().required('Le prix est requis').min(0, 'Le prix minimum est 0'),
  stock: Yup.number().required('Le stock est requis').min(0, 'Le stock minimum est 0'),
  image: Yup.mixed().test('required', 'L\'image est requise', (value:any) => {
    if (!value) return false; // No file is still valid
    return true
  }).test('fileType', 'Format de fichier non pris en charge', (value:any) => {
    if (!value) return true; // No file is still valid
    const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    return supportedFormats.includes(value.type);
  }).test('fileSize', 'File size is too large (max: 5000KB)', (value:any) => {
    if (!value) return true; // No file is still valid
    return value.size <= 5000000; // 5000KB in bytes
  }), 
})


const ProductCreate = () => {
  const [imageUrl, setImageUrl] = useState<string|null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const { rootStore: { productStore } } = useStore();
  const { createData, initForm } = productStore;
  
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      category_id: "",
      price: 0,
      stock: 0,
      image: "",
    }
  })

  const onSubmit = async (data:any) => {
    try {
      const formData = new FormData();
      Object.keys(data).map(key => {
        formData.append(key, data[key]);
      })
      const resData = await createData(formData)
      if (resData){
        reset()
        navigate('..')
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
  
  const initFormData = async () => {
    try{
        const resData = await initForm();
        setCategories(resData.data.categories)
    }catch(e: any){
      console.log(e);
    }
  }

  useEffect(() => {
    initFormData()
  }, [])
  return (
    <Box sx={{ width: '100%' }}>
    <h4>Créer</h4>
  <form onSubmit={handleSubmit(onSubmit)}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={6}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="name"
              label="Nom du produit"
              variant="filled"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              id="category_id"
              label="Catégorie"
              variant="filled"
              error={!!errors.category_id}
              helperText={errors.category_id?.message}
            >
              {categories.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="price"
              label="Prix"
              variant="filled"
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="stock"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="stock"
              label="Stock"
              variant="filled"
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        {imageUrl && <Card sx={{ maxWidth: 345, my: 5 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="auto"
          image={imageUrl ?? ""}
        />
      </Card>}
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              id="image"
              type='file'
              label="Image"
              variant="filled"
              focused
              onChange={(e: any) => {
                field.onChange(e.target.files[0])
                e.target.files.length > 0 ? setImageUrl(URL.createObjectURL(e.target.files[0])) : setImageUrl(null)
              }}
              error={!!errors.image}
              helperText={errors.image?.message}
            />
          )}
        />
      </Grid>
    </Grid>
    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
      Enregistrer
    </Button>
    <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={() => navigate(-1)}>
      retour
    </Button>
  </form>
</Box>
  )
}

export default observer(ProductCreate)