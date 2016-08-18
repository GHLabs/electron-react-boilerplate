import {map, includes, chain, reduce, some, toLower, compact, reject} from 'lodash'

// == Classification Helpers ===================================================
// Iterate through each permit row, lowercasing and seeing if keyword is included
// For every description, we return an array of classification codes
// [ [], ['EL'], ['EL', 'PB'] ]
export function classify(includeKeywords, excludeKeywords, records) {
  const includeKeywordMap = keywordTransform(includeKeywords)
  const excludeKeywordMap = keywordTransform(excludeKeywords)
  return chain(records)
    .map(record => ' ' + record.description.toLowerCase() + ' ')  // see (1) below
    .map(description => descriptionToClasses(description, includeKeywordMap, excludeKeywordMap))
    .value()
}


// Create an object with the keys as the classification abbreviation (DHW) and
// the value is an array of keywords
function keywordTransform(wordMap) {
  return reduce(wordMap, (acc, val, key) => {
    const wordArray = map(val.split(','), word => word ? toLower(word) : false)
    acc[key] = compact(wordArray)
    return acc
  }, {})
}


// If a keyword matches a word in the description, assign the description the
// classification the keyword belongs to
function descriptionToClasses(description, includeKeywordMap, excludeKeywordMap) {
  const includeMatched = compact(map(includeKeywordMap, (words, key) => {
    return includesAnyStrings(description, words) ? key : false
  }))
  const excludeMatched = compact(map(excludeKeywordMap, (words, key) => {
    return includesAnyStrings(description, words) ? key : false
  }))
  return reject(includeMatched, word => includes(excludeMatched, word))
}


// Check to see if any single keyword from array is included in the description
// Also supports a keyword match like this:
// keyword: word1...word2
// description: there is a word1 and a word2 in this sentence. (regex: /word1[\s\S]*word2/)
function includesAnyStrings(description, keywordArray) {
  return some(keywordArray, word => {
    const multiWordMatch = String(word).split('...')
    if (multiWordMatch.length > 1) {
      const re = new RegExp(multiWordMatch[0] + '[\\s\\S]*' + multiWordMatch[1], 'g')
      return re.test(description)
    } else {
      return includes(description, word)
    }
  })
}



// == Explanations =============================================================
// (1): 'WIRING FOR AC' matches or doesn't match the following scenarios:
// ' ac '  -> no match
// 'ac '   -> no match
// 'ac'    -> match because there is no space at the end of the description
// ' ac'   -> match because there is no space at the end of the description
// Solution: I've added blank space on each end of description so it will match
// like a unique word

// I will probably run into end-of-line character issues, but so far I haven't noticed it
