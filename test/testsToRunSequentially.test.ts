import { authentication } from './authentication.test'
import { home } from './home.test'
import { gallery } from './gallery.test'

/**
 * To test this file only
 * 
 * jest test/testsToRunSequentially.test.ts --forceExit --runInBand --verbose false
 * ./node_modules/.bin/jest test/testsToRunSequentially.test.ts --forceExit --runInBand --verbose false
 */

//describe('authentication', authentication)
//describe('home', home)
describe('gallery', gallery)
