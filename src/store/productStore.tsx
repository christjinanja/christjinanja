import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { ListItemButton } from "@mui/material";
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default class ProductStore {
    BASE_URL = process.env.REACT_APP_API_URL + '/v1/products'

    rootStore: IRootStore
    rowData: GridRowsProp[] = [];
    columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false, // Disable sorting
            filterable: false, // Disable filtering
            renderCell: (params) => (
                <>
                    <ListItemButton sx={{ width: 0 }} component={Link} to={'edit/' + params.row.id}><EditIcon /></ListItemButton>
                    <ListItemButton onClick={() => this.deleteDialog(params)}><DeleteIcon /></ListItemButton>
                </>
            ),
        },
        { field: 'id', headerName: 'Id', width: 100 },
        { field: 'name', headerName: 'Nom du produit', width: 150 },
        { field: 'category', headerName: 'Catégorie', width: 150 },
        { field: 'price', headerName: 'Prix', width: 200 },
        { field: 'stock', headerName: 'Stock', width: 200 },
    ];


    constructor(rootStore: IRootStore) {
        makeObservable(this, {
            rowData: observable,
            columns: observable,
            setRowData: action,
            fetchList: action,
            createData: action,
            getData: action,
            updateData: action,
            initForm: action,
        });
        this.rootStore = rootStore;
    }

    setRowData(values: GridRowsProp[]) {
        this.rowData = values;
    }

    //   Api Calls
    fetchList = async () => {
        try {
            const response = await fetch(this.BASE_URL + '/list', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json', // You can adjust this header as needed
                }
            })
            const data = await response.json();
            if (data.error) {
                this.rootStore.handleError(response.status, `Échec de la requête HTTP: ${response.status} ${response.statusText}`, data);
                return Promise.reject(data)
            } else {
                this.setRowData(data.data.products);
                return Promise.resolve(data)
            }
        } catch (error: any) {
            this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
        }
    }

    // InitForm
    initForm = async () => {
        try {
            const response = await fetch(this.BASE_URL + '/initForm', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                    'Content-Type': 'application/json', // You can adjust this header as needed
                }
            })
            const data = await response.json();
            if (data.error) {
                this.rootStore.handleError(response.status, `Échec de la requête HTTP: ${response.status} ${response.statusText}`, data);
                return Promise.reject(data)
            } else {
                return Promise.resolve(data)
            }
        } catch (error: any) {
            this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
        }
    }

    // Create
    createData = async (postData: any) => {
        try {
            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                },
                body: postData
            })

            const data = await response.json();
            if (data.error) {
                this.rootStore.handleError(response.status, data.message, data);
                return Promise.reject(data)
            } else {
                this.rootStore.alertStore.open({status: "success", message: data.message})
                return Promise.resolve(data)
            }
        } catch (error: any) {
            this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
        }
    }


    
  // View
  getData = async (id: number | string) => {
    try {

      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.rootStore.authStore.token}`,
          'Content-Type': 'application/json', // You can adjust this header as needed
        }
      })
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data)
      } else {
        return Promise.resolve(data)
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
    }
  }


   // Update
   updateData = async (id: number | string, postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.rootStore.authStore.token}`,
        },
        body: postData
      })

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status,  data.message, data);
        return Promise.reject(data)
      } else {
        this.rootStore.alertStore.open({status: "success", message: data.message})
        return Promise.resolve(data)
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
    }
  }

  
  // Delete
  deleteData = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.rootStore.authStore.token}`,
          'Content-Type': 'application/json', // You can adjust this header as needed
        }
      })

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data)
      } else {
        this.setRowData(this.rowData.filter((e:any) => e.id != id))
        this.rootStore.alertStore.open({status: "success", message: data.message})
        return Promise.resolve(data)
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
    }
  }

   // Delete
   deleteDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
        confirmFn: () => this.deleteData(params.row.id),
        dialogText: "Êtes-vous sûr de vouloir supprimer cet élément ?"
      })
  }

  
   //   Api Calls
   getList = async (postData:any) => {
    try {
          const response = await fetch(this.BASE_URL + '/getList', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${this.rootStore.authStore.token}`,
                  'Content-Type': 'application/json', // You can adjust this header as needed
              },
              body: JSON.stringify(postData)
          })
          const data = await response.json();
          if (data.error) {
              this.rootStore.handleError(response.status, `Échec de la requête HTTP: ${response.status} ${response.statusText}`, data);
              return Promise.reject(data)
          } else {
              return Promise.resolve(data.data.products)
          }
      } catch (error: any) {
          this.rootStore.handleError(419, "Quelque chose a mal tourné !", error)
      }
  }
}