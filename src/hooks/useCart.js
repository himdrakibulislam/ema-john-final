import { useState, useEffect } from 'react';
import { getStoredCart } from '../utilities/fakedb';

const useCart = products => {
    const [cart, setCart] = useState([]);
    
    useEffect(() => {
        const savedCart = getStoredCart()
        const keys = Object.keys(savedCart);
        fetch('http://localhost:5000/products/bykeys',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify(keys)
        })
        .then(res => res.json())
        .then(products => {
            if (products.length) {
                ;
                 const storedCart = [];
                 for (const key in savedCart) {
                     const addedProduct = products.find(product => product.key === key);
                     if (addedProduct) {
                         // set quantity
                         const quantity = savedCart[key];
                         addedProduct.quantity = quantity;
                         storedCart.push(addedProduct);
                     }
                 }
                 setCart(storedCart);
             }
        })
       

    }, [products]);

    return [cart, setCart];
}

export default useCart;