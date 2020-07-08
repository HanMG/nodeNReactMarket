import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import {Icon, Col, Card, Row, Button} from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSilder'

function LandingPage() {

    const [Products, setProducts] = useState([])

    // 불러올 상품수 시작부분
    const [Skip, setSkip] = useState(0)
    // 불러올 상품수
    const [Limit, setLimit] = useState(8)
    // 더보기버튼의 출력여부를 위한 전체 상품수
    const [PostSize, setPostSize] = useState(0)


    useEffect(() =>{       

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
        

    }, [])

    const getProducts = (body) =>{
        Axios.post('/api/product/products', body)
            .then(response =>{
                if(response.data.success){
                    if(body.loadMore){
                        setProducts([...Products, ...response.data.productInfo])
                    }else{
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)                    
                }else{
                    alert('상품들을 가지고 오는데 실패했습니다.')
                }
            })
    }

    const loadMoreHandler = () =>{
        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)

        setSkip(skip)
    }

    const renderCards = Products.map((product, index) =>{

        return <Col lg={6} md={8} xs={24} key={index}>
            <Card                
                cover={<ImageSlider images={product.images} />}
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

           <br />
           {PostSize >= Limit &&
                <div style={{display:'flex', justifyContent:'center'}}>
                        <Button onClick={loadMoreHandler}>더보기</Button>
                </div>
           }

       </div>
    )
}

export default LandingPage
