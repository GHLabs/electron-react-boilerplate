import {keys, map, size, reduce, includes} from 'lodash'


export function exportColumns(records, abbreviations) {
  const recordKeys = keys(records[0])
  return recordKeys.concat(abbreviations)
}


export function joinRecords(filteredRecords, classifications, abbreviations) {
  if (size(filteredRecords) === 0) {
    return []
  }
  return map(filteredRecords, record => {
    const matchingClasses = classifications[record.id]
    const classes = reduce(abbreviations, (acc, abbreviation) => {
      acc[abbreviation] = includes(matchingClasses, abbreviation) ? record.year : null
      return acc
    }, {})
    return {...record, ...classes}
  })
}
