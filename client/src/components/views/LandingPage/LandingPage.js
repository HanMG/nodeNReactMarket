import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import {Icon, Col, Card, Row, Button} from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSilder'
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import SearchFeature from './Sections/SearchFeature'
import { continents, price } from './Sections/Datas'


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
    const [SearchTerm, setSearchTerm] = useState("")


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

    const showFilteredResults = (filters) =>{

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters            
        }

        getProducts(body)
        setSkip(0)

    }

    // 가격 범위를 array에 담아 priceValues로 보냄
    const handlePrice = (value) =>{
        const data = price;
        let array = [];

        for(let key in data){

            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array;
            }
        }

        return array
    }
    

    // 필터 - 체크박스 라디오 박스 
    const handleFilter = (filters, category) => {
        const newFilters = {...Filters}

        newFilters[category] = filters

        if(category === "price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        console.log(newFilters)

        showFilteredResults(newFilters)

        setFilters(newFilters)        
    }

    // 검색 컴포넌트로 부터 값을 받아옴
    const updateSearchTerm = (newSearchTerm) =>{
        

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        
        getProducts(body)
    }

    return (
       <div style={{width:'75%', margin: '3rem auto'}}>
           <div style={{textAlign: 'center'}}>
               <h2>Let's Travel Anywhere</h2>
           </div>
           {/* Filter */}

            <Row gutter={[16,16]}>
                {/* CheckBox */}
                <Col lg={12} xs={24}>                    
                   <CheckBox list={continents} handleFilters={filters => handleFilter(filters, "continents" )} />         
                </Col>
                {/* RadioBox */} 
                <Col lg={12} xs={24}>
                    <RadioBox list={price} handleFilters={filters => handleFilter(filters, "price" )}/>
                </Col>
            </Row>
           

                     

           {/* Search */}
           <div style={{display:'flex', justifyContent:'flex-end', margin: '1rem auto'}}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
           </div>

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
