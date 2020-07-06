import React from 'react'
import {Icon, Col, Card, Row, Carousel} from 'antd'

function ImageSilder(props) {
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image,index)=>(
                    <div key={index}>
                        <img style={{width:'100%', height:'150px'}} src={`http://localhost:5000/${image}`}/>
                    </div>
                ))}                
            </Carousel>
        </div>
    )
}

export default ImageSilder
