import React, { useEffect, useState } from 'react';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import { addToDb } from '../../utilities/fakedb';
import './Shop.css';
import useCart from '../../hooks/useCart';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useCart(products);
    // products to be rendered on the UI
    const [displayProducts, setDisplayProducts] = useState([]);
    const [pageCount,setPageCount] = useState(0);
    const [pages,setPages] = useState();
    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${pages}&&size=${size}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setDisplayProducts(data.products);
                const count = data.count;
                const pageNumber = Math.ceil(count/size)
                setPageCount(pageNumber)
            });
    }, [pages]);

    const handleAddToCart = (product) => {
        const exists = cart.find(pd => pd.key === product.key);
        let newCart = [];
        if (exists) {
            const rest = cart.filter(pd => pd.key !== product.key);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, product];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        // save to local storage (for now)
        addToDb(product.key);

    }

    const handleSearch = event => {
        const searchText = event.target.value;

        const matchedProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));

        setDisplayProducts(matchedProducts);
    }
    const page = [...Array(pageCount).keys()];
    const size = 10;
    return (
        <>
            <div className="search-container">
                <input
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search Product" />
            </div>
            <div className="shop-container">
                <div className="product-container">
                    {
                        displayProducts.map(product => <Product
                            key={product._id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        >
                        </Product>)
                    }
                    <div className="pagination">
                        {
                            page.map(number => <button key={number} className={number === pages?'selected': ''} onClick={()=>setPages(number)} >{number+1}</button>)
                        }
                        <div class="dropdown">
                    <button class="dropbtn">See Items</button>
                    <div class="dropdown-content">
                        <p>10</p>
                        <p>20</p>
                        <p>30</p>
                    </div>
                    </div>
                </div>
                </div>
                <div className="cart-container">
                    <Cart cart={cart}>
                        <Link to="/review">
                            <button className="btn-regular">Review Your Order</button>
                        </Link>
                    </Cart>
                </div>
               
            </div>
            
        </>
    );
};

export default Shop;