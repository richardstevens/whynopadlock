import chai from 'chai'
import chaiLint from 'chai-lint'
import crawler from '../lib/whynopadlock'
import sinon from 'sinon'
chai.use(chaiLint)
const { expect } = chai

describe('whynopadlock Crawler', () => {
  let files

  beforeEach(() => {
    files = [
      'https://www.google.com/'
    ]
  })

  it('everything should match', done => {
    expect(files).to.be.a('array')
    expect(crawler).to.be.a('function')
    done()
  })

  it('should allow to be called', done => {
    const cb = (err, res) => {
      expect(err).to.be.a('null')
      expect(res).to.equal('success')
      done()
    }
    crawler(files, cb)
  }).timeout(15000)

  it('should return blank if no files', done => {
    const cb = (err, res) => {
      expect(err.message).to.equal('No pages provided')
      done()
    }
    crawler([ ], cb)
  })
})
