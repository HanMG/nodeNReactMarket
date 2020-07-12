import React,{useState, useEffect} from 'react'
import Axios from "axios";
import { useDispatch } from 'react-redux'
import { getCartItems } from '../../../_actions/user_actions'

function CartPage(props) {
    const dispatch = useDispatch();

    useEffect(() => {

        let cartItems = []

        // 리덕스 User state안의 cart안에 상품이 들어있는지 확인
        if(props.user.userData && props.user.userData.cart){
            if(props.user.userData.cart.length > 0){
                props.user.userData.cart.forEach(item =>{
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
            }
        }

        
    }, [props.user.userData])

    return (
        <div>
            CartPage
        </div>
    )
}

export default CartPage
