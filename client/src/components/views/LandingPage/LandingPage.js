import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import {Icon, Col, Card, Row} from 'antd'
import Meta from 'antd/lib/card/Meta'

function LandingPage() {

    const [Products, setProducts] = useState([])

    useEffect(() => {       

        Axios.post('/api/product/products')
            .then(response =>{
                if(response.data.success){
                    setProducts(response.data.productInfo)
                }else{
                    alert('상품들을 가지고 오는데 실패했습니다.')
                }
            })

    }, [])

    const renderCards = Products.map((product, index) =>{

        return <Col lg={6} md={8} xs={24} key={index}>
            <Card                
                cover={<img style={{width:'100%', height:'150px'}} src={`http://localhost:5000/${product.images[0]}`} />}
            >
                <Meta 
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    return (
       <div style={{width:'75%', margin: '3rem auto'}}>
           <div style={{textAlign: 'center'}}>
               <h2>Let's Travel Anywhere</h2>
           </div>
           {/* Filter */}

           {/* Search */}

           {/* Card */}
           <Row gutter={[16,16]}>
            {renderCards}
           </Row>

       </div>
    )
}

export default LandingPage
