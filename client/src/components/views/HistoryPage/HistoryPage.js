import React from 'react'

function HisroryPage(props) {

    

    return (
        <div style={{width:'80%', margin: '3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h1>History</h1>                        
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>Payment Id</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>Date of Purchase</td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.user.userData && 
                            props.user.userData.history.map((item, index) =>(
                                <tr key={index}>
                                    <td>{item.paymentId}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.dateOfPurchase}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            
        </div>

    )
}

export default HisroryPage
