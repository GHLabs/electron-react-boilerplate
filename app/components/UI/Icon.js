import React, {PropTypes} from 'react'
import {map} from 'lodash'


// You can pass multiple icons as a comma-separated string
export function Icon(props) {
  const icons = props.icon ? props.icon.split(',') : []
  if (!icons.length) {
    return <span />
  }
  return (
    <span>
      {map(icons, (icon, index) => {
        const gap = index < icons.length ? iconSpacing : {}
        return (
          <i className={`fa fa-${icon} ${props.spin ? 'fa-spin' : ''}`}
            style={gap}
            key={icon} />
        )
      })}
    </span>
  )
}

Icon.propTypes = {
  icon: PropTypes.string
}

const iconSpacing = {
  marginRight: '2px'
}
