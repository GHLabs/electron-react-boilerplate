import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import mobx, {action} from 'mobx'
import {map, kebabCase, lowerCase} from 'lodash'
import SelectBox from 'react-select-box'


@observer
export default class BuildingCategoryFilters extends Component {

  static propTypes = {
    store: PropTypes.object,
    label: PropTypes.string.isRequired
  }

  componentWillMount() {
    this.selectOptions = getOptions(this.props.store.permitTypeSet.toJS())
  }

  @action updateFilters = (buildingCategories) => {
    this.props.store.updateBuildingCategoryFilters(buildingCategories)
  }

  render() {
    const {store, label} = this.props
    return (
      <div style={{marginTop: '-20px'}}>
        <SelectBox
          multiple
          label={label}
          scrollOnFocus={false}
          value={mobx.toJS(store.buildingCategoryFilters)}
          onChange={this.updateFilters}>
          {getOptions(store.buildingCategorySet)}
        </SelectBox>
      </div>
    )
  }
}


function getOptions(buildingCategorySet) {
  return map(buildingCategorySet, category => {
    return <option value={lowerCase(category)} key={kebabCase(category)}>{category}</option>
  })
}
