import _ from 'lodash'


export function updateOrAddClassificationDefFB({classificationDefs, classificationDefsRef, newDefinition, includeKeywordSetsRef, excludeKeywordSetsRef}) {
  const {newAbbreviation, oldAbbreviation, color, label, textColor} = newDefinition
  const def = {abbreviation: newAbbreviation, color, label, textColor}

  // Find the array index of the defintion based on the old abbreviation.
  // Update the definition at that index with the new abbreviation
  const oldDefinition = _.find(classificationDefs, {abbreviation: oldAbbreviation})
  const defIndex = _.indexOf(classificationDefs, oldDefinition)
  const definitionExists = defIndex !== -1

  // 1. If it's a new def, insert it. If it exists already, updated it based on the original index
  const newClassificationDefs = definitionExists
    ? [...classificationDefs.slice(0, defIndex), def, ...classificationDefs.slice(defIndex + 1)]
    : [...classificationDefs, def]
  classificationDefsRef.set(newClassificationDefs)

  // 2. If renaming an abbreviation, go through other keyword sets and rename those abbreviations
  if (definitionExists && newAbbreviation !== oldAbbreviation) {
    includeKeywordSetsRef.once('value', snap => {
      includeKeywordSetsRef.update(getRenamedAbbreviations(snap.val(), oldAbbreviation, newAbbreviation))
    })
    excludeKeywordSetsRef.once('value', snap => {
      excludeKeywordSetsRef.update(getRenamedAbbreviations(snap.val(), oldAbbreviation, newAbbreviation))
    })
  }

  // 3. If adding a new definition, go through other keyword sets and add a new def with empty keywords
  if (!definitionExists) {
    includeKeywordSetsRef.once('value', snap => {
      includeKeywordSetsRef.update(addNewAbbreviation(snap.val(), newAbbreviation))
    })
    excludeKeywordSetsRef.once('value', snap => {
      excludeKeywordSetsRef.update(addNewAbbreviation(snap.val(), newAbbreviation))
    })
  }
}


function getRenamedAbbreviations(keywordObject, oldAbbreviation, newAbbreviation) {
  return _.reduce(keywordObject, (acc, val, key) => {
    const oldKeywordString = val[oldAbbreviation]

    // Firebase can not have undefined values
    if (_.isUndefined(oldKeywordString)) {
      return acc
    }

    // Swap abbreviation keys. A null value will delete the key in Firebase
    acc[`/${key}/`] = {...val, [oldAbbreviation]: null, [newAbbreviation]: oldKeywordString}
    return acc
  }, {})
}


function addNewAbbreviation(keywordObject, newAbbreviation) {
  return _.reduce(keywordObject, (acc, val, key) => {
    acc[`/${key}/`] = {...val, [newAbbreviation]: ''}
    return acc
  }, {})
}
