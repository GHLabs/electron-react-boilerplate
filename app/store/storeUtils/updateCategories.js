import {includes, without} from 'lodash'


export function updateCategoryFilters(abbreviation, categoryFilters) {
  switch(true) {

    // deselect classification if it's already selected
    case includes(categoryFilters, abbreviation): {
      return without(categoryFilters, abbreviation)
    }

    // Create a new array with the abbreviation added
    case Boolean(abbreviation): {
      return categoryFilters.concat(abbreviation)
    }

    // 'All' category (remove all categories)
    default: return []
  }
}
