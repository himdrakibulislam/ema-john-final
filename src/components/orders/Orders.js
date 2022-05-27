import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useAuth from '../../hooks/useAuth';

const Orders = () => {
    const [orders,setOrders] = useState([])
    const { user } = useAuth();
    const history = useHistory()
    useEffect(()=>{
        fetch(`http://localhost:5000/ordersEmail?email=${user.email}`,{
            headers:{
                'authorization':`Bearer ${localStorage.getItem('idToken')}`
            }
        })
        .then(res => {
            if(res.status === 200){
               return res.json()
            }
            else if(res.status ===401){
                history.push('/login')
            }
        })
        .then(data => setOrders(data))
    },[])
    return (
        <div>
            <h3>My Orders {orders.length}</h3>
            {
                orders.map(order => <li key={order._id}>{order.name}: {order.email}</li>)
            }
        </div>
    );
};

export default Orders;