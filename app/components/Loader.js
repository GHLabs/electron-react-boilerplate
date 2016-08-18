import React, {PropTypes} from 'react'
import {Icon} from './UI'


export default function Loader(props) {
  return (
    <div style={backgroundStyle}>
      <div className='container'>
        <h1 style={{fontWeight: 200}}>
          Loading Data
          {/*<Icon icon='circle-o-notch' spin />*/}
        </h1>
      </div>

    </div>
  )
}


const backgroundStyle = {
  left: 0,
  right: 0,
  backgroundColor: '#EFEEEE',
  color: '#000',
  height: '900px'
}
