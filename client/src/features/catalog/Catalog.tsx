import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    //because setProducts(data) causes a rerender, we need , [] as second parameter of useEffect
    //because we don't want to rerender the populated setProducts array every time. Now useEffect is only called once
    // when the component loads and never again
    useEffect(() => {
      fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
    }, [])

    return (
     <>
        <ProductList products={products}/>
     </>
    )
}