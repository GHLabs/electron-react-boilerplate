import React, {PropTypes} from 'react'
import {palette} from '../../constants/AppConstants'
import {Icon} from './Icon'

export function Button(props) {
  const btnStyles = {...styles, ...props.style}
  return (
    <button className='btn btn-sm' style={btnStyles} onClick={props.onClick}>
      <Icon icon={props.icon} spin={props.spin} />
      {props.children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onClick: PropTypes.func,
  style: PropTypes.object,
  icon: PropTypes.string,
  spin: PropTypes.bool
}

const styles = {
  backgroundColor: palette.darkBackground,
  color: palette.lightText2
}
