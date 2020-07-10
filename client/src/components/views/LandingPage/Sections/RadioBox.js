import React, {useState} from 'react'
import { Collapse, Checkbox, Radio } from 'antd'

const {Panel} = Collapse

function RadioBox(props) {
    
    const [Value, setValue] = useState(0)

    // 라디오 그룹에 들어갈 라디오버튼들 생성
    const renderRadioBox = () => (
        props.list && props.list.map(value =>(
            <Radio key={value._id} value={value._id}>
                {value.name}
            </Radio>
        ))
    )

    // 라디오 값 변경 및 부모컴포넌트로 값 이동
    const handleChange = (event) =>{
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }
    

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>                
            </Collapse>
        </div>
    )
}

export default RadioBox