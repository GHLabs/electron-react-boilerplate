import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import mobx, {action} from 'mobx'
import {map, kebabCase, lowerCase} from 'lodash'
import SelectBox from 'react-select-box'


@observer
export default class PermitTypeFilters extends Component {

  static propTypes = {
    store: PropTypes.object,
    label: PropTypes.string.isRequired
  }

  componentWillMount() {
    this.selectOptions = getOptions(this.props.store.permitTypeSet.toJS())
  }

  @action updateFilters = (permitTypes) => {
    this.props.store.updatePermitTypeFilters(permitTypes)
  }

  render() {
    const {store, label} = this.props
    return (
      <div style={{marginTop: '-20px'}}>
        <SelectBox
          multiple
          label={label}
          scrollOnFocus={false}
          value={mobx.toJS(store.permitTypeFilters)}
          onChange={this.updateFilters}>
          {getOptions(store.permitTypeSet)}
        </SelectBox>
      </div>
    )
  }
}


function getOptions(permitTypeSet) {
  return map(permitTypeSet, (type, index) => {
    // console.log('key: ', `${index}-${kebabCase(type)}`)
    return <option value={lowerCase(type)} key={`${index}-${kebabCase(type)}`}>{type}</option>
  })
}
