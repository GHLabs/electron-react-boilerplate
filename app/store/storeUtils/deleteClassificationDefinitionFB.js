import _ from 'lodash'


export function deleteClassificationDefinitionFB(abbreviation, classificationDefsRef, includeKeywordsRef, excludeKeywordsRef) {

  // Delete array item from classificationDefs
  classificationDefsRef.once('value', snap => {
    const defArray = snap.val()
    const defToDelete = _.find(defArray, {abbreviation: abbreviation})
    const index = _.indexOf(defArray, defToDelete)
    classificationDefsRef.set([
      ...defArray.slice(0, index),
      ...defArray.slice(index + 1)
    ])
  })


  // Delete any abbreviations (and it's keywords) from includeKeywords and excludeKeywords
  // This is destructive and is warned against in the modal
  includeKeywordsRef.once('value', snap => {
    includeKeywordsRef.update(deleteAbbreviations(snap.val(), abbreviation))
  })
  excludeKeywordsRef.once('value', snap => {
    excludeKeywordsRef.update(deleteAbbreviations(snap.val(), abbreviation))
  })
}


// Go into each keyword set and delete the abbrevation.
// All classification defs has to be consistent across keyword sets
function deleteAbbreviations(keywordObject, abbreviation) {

  // Make sure we don't corrupt the top-level data structure
  if (_.isEmpty(keywordObject)) {
    return {}
  }

  // A value of null will automatically remove the key in FB
  return _.reduce(keywordObject, (acc, val, key) => {
    acc[`/${key}/`] = {...val, [abbreviation]: null}
    return acc
  }, {})
}
