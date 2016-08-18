import {includes, some} from 'lodash'


export function filterSelectBoxSelections(filters, dimension, dimensions) {
  if (filters.length > 0) {
    dimensions[dimension].filterFunction(permitType => {
      return some(filters, filter => includes(permitType, filter))
    })
  } else {
    dimensions[dimension].filterAll()
  }
  return dimensions[dimension].top(Infinity).length
}
