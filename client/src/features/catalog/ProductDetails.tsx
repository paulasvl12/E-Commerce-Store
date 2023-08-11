import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails(){

    const {id} = useParams<{id: string}>();
    const{basket, status } = useAppSelector(state => state.basket);
    const dispatch= useAppDispatch();
    const product = useAppSelector(state => productSelectors.selectById(state, id!));
    const {status: productStatus} = useAppSelector(state => state.catalog);
    const [quantity, setQuantity] = useState(0);
    const item = basket?.items.find(i => i.productId === product?.id);
    //in this case, useEffect() has a dependency of id so we need to add it as second parameter. That means that 
    //instead of being only called once like we did when we had the empty array[], it is called every time
    //'id' changes. It makes sense that we only ever want to load products once, but we need to reload every time
    //we switch between products
    useEffect(() => {
        if(item) setQuantity(item.quantity);
        if (!product && id) dispatch(fetchProductAsync(parseInt(id)));

    }, [id, item, dispatch, product])

    function handleInputChange(event: any) {
        if(event.target.value >= 0) {
            setQuantity(parseInt(event.target.value));
        }
    }

    function handleUpdateCart(){
        if(!item || quantity > item.quantity){
            const updatedQuantity = item ? quantity - item.quantity : quantity;
           dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
        } else {
            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
        }
    }

    if(productStatus.includes('pending')) return <LoadingComponent message='Loading Product...' />

    if(!product) return <NotFound />

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'> {product.name} </Typography>
                <Divider sx={{mb: 2}}/>
                <Typography variant='h4' color='secondary'> ${(product.price/100).toFixed(2)} </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in Stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField onChange={handleInputChange} variant='outlined' type='number' label='Quantity in Cart' fullWidth value={quantity}>
                            
                        </TextField>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} loading={status.includes('pending')} onClick={handleUpdateCart} sx={{height: '55px'}} color='primary' size='large' variant='contained' fullWidth>
                        {item ? 'Update Quantity' : 'Add to Cart'}
                    </LoadingButton>
                </Grid>
            </Grid>
        </Grid>
    )
}