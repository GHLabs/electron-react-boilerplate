import Papa from 'papaparse'
import _ from 'lodash'
import fs from 'fs'
import * as f from './permit_locations/boulder_county'

console.log('Papa: ', Papa)

// To Run:
// iron-node data/transforms/permit_runner.js boulder_city preview
// node --max-old-space-size=8192 data/transforms/permit_runner.js boulder_city  // increase memory allocation to 8GB
const locationArg = process.argv[2]
const locations = ['boulder_city', 'boulder_unincorporated', 'louisville']
if (!_.includes(locations, locationArg)) {
  throw new Error(`Location argument doesnt match. Must be one of ${locations}`)
}

// Pass in a 'preview' as third argument to only process 1000
const usePreview = process.argv[3] === 'preview'
console.log('usePreview: ', usePreview)
console.log('location: ', locationArg)

// CSV config
const csvConfig = {
  header: true,
  skipEmptyLines: true,
  preview: usePreview ? 1000 : false
}


// Load and process assessor addresses to be joined with assessor record based on strap id
const filePath = process.env.PWD + `/data/raw/${locationArg}.csv`
console.log('filePath: ', filePath)

const parsed = Papa.parse(fs.readFileSync(filePath, "utf8"), csvConfig)
console.log('parsed: ', parsed)
const rows = parsed.data
if (!_.isEmpty(parsed.errors)) {
  console.log('errors: ', parsed.errors)
  throw new Error(`Error loading and parsing files. Make sure your file names are one of ${locations}. ${parsed.errors}`)
}


function permitTransformsByLocation(location) {
  console.log('location: ', location)
  switch(location) {
    case 'boulder_city': return f.boulderCity(rows)
    case 'boulder_unincorporated': return f.boulderUnincorporated(rows)
    case 'louisville': return f.louisville(rows)
    default: {
      throw new Error('City not found')
    }
  }
}
const permits = permitTransformsByLocation(locationArg)
console.log('permits count: ', _.size(permits))
// console.log('permits: ', permits)


if (usePreview) {
  fs.writeFileSync(process.env.PWD + '/data/ready/' + locationArg + '_preview.json', JSON.stringify(_.take(permits, 1000), null, 2))
} else {
  fs.writeFileSync(process.env.PWD + '/data/ready/' + locationArg + '.json', JSON.stringify(permits, null, 2))
  fs.writeFileSync(process.env.PWD + '/data/ready/' + locationArg + '.csv', Papa.unparse(permits))
}




console.log('done')
