import { jsdom } from 'jsdom'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())

global.document = jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.navigator = global.window.navigator