import React,{useState, useEffect} from 'react'
import Axios from "axios";
import { useDispatch } from 'react-redux'
import { getCartItems, removeCartItem } from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'


function CartPage(props) {
    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)

    useEffect(() => {

        let cartItems = []

        // 리덕스 User state안의 cart안에 상품이 들어있는지 확인
        if(props.user.userData && props.user.userData.cart){
            if(props.user.userData.cart.length > 0){
                props.user.userData.cart.forEach(item =>{
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response =>{
                        calculateTotal(response.payload)
                    })
            }
        }
        
    }, [props.user.userData])

    // 총 금액 구하는 함수
    let calculateTotal = (cartDetail) =>{
        let total = 0

        cartDetail.map(item =>{
            total += parseInt(item.price, 10)*item.quantity
        })

        setTotal(total)
    }

    // Remove클릭시 카트에서 제거, 리덕스 user_actions로 
    let removeFromCart = (productId) =>{
        dispatch(removeCartItem(productId))            
    }

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>            
            <h1>My Cart</h1>
            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>
            </div>
            <div style={{marginTop: '3rem'}}>
                <h2>Total Amount:  ${Total}</h2>
            </div>
        </div>
    )
}

export default CartPage
