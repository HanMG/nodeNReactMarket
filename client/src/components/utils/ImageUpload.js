import React, {useState, useEffect} from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd'
import Axios from 'axios'
import './ImageUpload.css'

function FileUpload(props) {

    const [Images, setImages] = useState([])

    const dropHandler = (files) =>{

        // 파일 보낼때 필요한 부분
        let formData = new FormData();

        const config = {
            header: {'content-type': 'multipart/form-data'}
        }

        formData.append('file', files[0])

        Axios.post('/api/product/image', formData, config)
            .then(response =>{
                if(response.data.success){
                    //console.log(response.data)
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])
                }else{
                    alert('이미지 파일 저장에 실패하였습니다.')
                }
            })
    }

    // 클릭한 이미지 제거
    const deleteHandler = (image) =>{
        const currentIndex = Images.indexOf(image)

        // 현재 저장된 이미지배열을 복사
        let newImages = [...Images]        
        // 복사된이미지배열에서 spilce를 사용해 currentIndex로부터, 1개 지운다. (즉 해당이미지만)
        newImages.splice(currentIndex, 1)
        // 삭제실행 후 이미지배열을 다시 저장
        setImages(newImages)  
        // 부모 컴포넌트로 올리는 작업
        props.refreshFunction(newImages)

    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Dropzone onDrop={dropHandler}>
            {({getRootProps, getInputProps}) => (
                <section>
                <div 
                    style={{
                        width: 300, height: 240, border: '1px solid lightgray',
                        display:'flex', alignItems:'center', justifyContent:'center'
                    }}
                    {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Icon type="plus" style={{fontSize:'3rem'}} />
                </div>
                </section>
            )}
            </Dropzone>

            <div className="ImageScroll">
                    {Images.map((image, index) =>(
                        <div onClick={()=> deleteHandler(image)} key={index}>
                            <img style={{minWidth: '300px', width:'300px', height:'220px'}}
                                src={`http://localhost:5000/${image}`}
                            />
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default FileUpload