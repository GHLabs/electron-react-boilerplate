import {includes} from 'lodash'
import {minSearchString} from '../../constants/AppConstants'


// Don't trigger search until we have at least 3 characters. Otherwise remove
// filters for this dimension
export function filterSearch(searchString, dimensions) {
  if (searchString.length > minSearchString) {
    dimensions.sanitizedDescription.filterFunction(description => includes(description, searchString))
  } else {
    dimensions.sanitizedDescription.filterAll()
  }
  return dimensions.sanitizedDescription.top(Infinity).length
}
