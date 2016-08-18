import React, {Component, PropTypes} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {map, isEmpty, includes} from 'lodash'


@observer
class FilterBadge extends Component {

  static propTypes = {
    store: PropTypes.object,
    definition: PropTypes.object,
    categoryFilters: PropTypes.object,
    clearFilters: PropTypes.bool,
  }

  @action updateFilters = (abbreviation) => {
    this.props.store.updateCategoryFilters(abbreviation)
  }

  render() {
    const {definition, categoryFilters, clearFilters} = this.props
    const badgeStyle = {backgroundColor: definition.color, color: definition.textColor, cursor: 'pointer', WebkitUserSelect: 'none'}
    const isActive = clearFilters
      ? isEmpty(categoryFilters) ? activeBadgeStyle : {}
      : includes(categoryFilters, definition.abbreviation) ? activeBadgeStyle : {}
    return (
      <div style={{display: 'inline-block'}}>
        <span
          className="badge"
          onClick={this.updateFilters.bind(this, clearFilters ? null : definition.abbreviation)}
          style={badgeStyle}>
          {definition.abbreviation}
        </span>
        <div style={isActive} />
      </div>
    )
  }
}


@observer
export default class CategoryFilters extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  render() {
    const {store} = this.props
    const {classificationDefs, categoryFilters} = store
    return (
      <div style={{marginTop: '12px'}}>
        {/*<h6 style={{display: 'inline-block', marginRight: 16}}>Categories</h6>*/}

        <FilterBadge
          store={store}
          clearFilters
          definition={{color: '#333', abbreviation: 'All'}}
          categoryFilters={categoryFilters} />

        <span>&nbsp;&nbsp;</span>

        {map(classificationDefs, def => (
          <FilterBadge
            key={def.abbreviation}
            store={store}
            definition={def}
            categoryFilters={categoryFilters} />
        ))}

        <FilterBadge
          store={store}
          definition={{color: '#777', abbreviation: 'Unclassified'}}
          categoryFilters={categoryFilters} />

      </div>
    )
  }
}

const activeBadgeStyle = {
  width: '6px',
  height: '6px',
  backgroundColor: '#000',
  borderRadius: '6px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '4px'
}
