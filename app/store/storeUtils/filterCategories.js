import {includes, some} from 'lodash'
import mobx from 'mobx'

export function filterCategories(categoryFilters, dimensions, classifications) {
  // Remove all of the observable methods for quicker iterating
  const filters = mobx.toJS(categoryFilters)
  const hasUnclassified = includes(filters, 'Unclassified')

  if (categoryFilters.length > 0) {
    dimensions.id.filterFunction(id => {

      // Keep this record if it has no classifications and we have 'Unclassified' as a category
      if (hasUnclassified && classifications[id].length === 0) {
        return true
      }

      // If the categoryFilters array and the classification array (for this record)
      // has common elements, keep it. Using early returns with some and includes for speed
      return some(filters, filter => includes(classifications[id], filter))
    })
  } else {

    // No categories to filter on. filterAll() clears all filters for this dimension
    dimensions.id.filterAll()
  }

  return dimensions.id.top(Infinity).length
}
