import React, {useEffect, useState} from 'react'
import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const { Search } = Input;

function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState("")

    // 검색값을 저장
    const searchHandler = (event) =>{
        setSearchTerm(event.currentTarget.value)
        // 부모컴포넌트로 값 업데이트
        props.refreshFunction(event.currentTarget.value)
    }

    return (
        <div>
            <Search
                placeholder="input search text"
                onChange={searchHandler}
                style={{ width: 200 }}
                value={SearchTerm}
            />
        </div>
    )
}

export default SearchFeature
