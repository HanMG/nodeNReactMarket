import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import numeral from 'numeral'
import {Icon, Col, Card, Row, Button} from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSilder'
import CheckBox from './Sections/CheckBox'
import { continents } from './Sections/Datas'


function LandingPage() {

    const [Products, setProducts] = useState([])

    // 불러올 상품수 시작부분
    const [Skip, setSkip] = useState(0)
    // 불러올 상품수
    const [Limit, setLimit] = useState(8)
    // 더보기버튼의 출력여부를 위한 가져온 상품수
    const [PostSize, setPostSize] = useState(0)
    // 필터관련 State
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })


    useEffect(() =>{       

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
        

    }, [])
    

    // 상품 가져오기
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

    // 더보기
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

    // 카드
    const renderCards = Products.map((product, index) =>{
        let price = numeral(product.price).format('0,0')
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card                
                cover={<ImageSlider images={product.images} />}
            >
                <Meta 
                    title={product.title}
                    description={`₩${price}원`}
                />
            </Card>
        </Col>
    })    

    const showFilteredResults = (filters) =>{

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters            
        }

        getProducts(body)
        setSkip(0)

    }

    const handleFilter = (filters, category) => {
        const newFilters = {...Filters}

        newFilters[category] = filters

        showFilteredResults(newFilters)
    }

    return (
       <div style={{width:'75%', margin: '3rem auto'}}>
           <div style={{textAlign: 'center'}}>
               <h2>Let's Travel Anywhere</h2>
           </div>
           {/* Filter */}

           {/* CheckBox */}
           <CheckBox list={continents} handleFilters={filters => handleFilter(filters, "continents" )} />

           {/* RadioBox */}

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
