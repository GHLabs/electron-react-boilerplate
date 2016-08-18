import _ from 'lodash'
// import {toJS} from 'mobx'

/*
  Takes the classification definition object and returns a keword set like
  {EL: '', PB: ''}

  This is used when creating a new keyword set. There is a hard constraint that
  classification definitions must be consistent across all keyword sets so the
  keyword sets can be joined into useful data
*/
export async function createNewKeywordSet(store, keywordSetToDuplicate) {
  if (keywordSetToDuplicate === 'none') {
    const emptyKeywordSet = createEmptyKeywordSet(store)
    return {
      includeKeywords: emptyKeywordSet,
      excludeKeywords: emptyKeywordSet,
    }
  } else {
    return {
      includeKeywords: await store.includeKeywordsRef.once('value').then(snap => snap.val()),
      excludeKeywords: await store.excludeKeywordsRef.once('value').then(snap => snap.val())
    }
  }
}


function createEmptyKeywordSet(store) {
  return _.reduce(store.classificationDefs, (acc, item) => {
    acc[item['abbreviation']] = ''
    return acc
  }, {})
}
