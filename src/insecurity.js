import insecurity from 'insecurity'
import cheerio from 'cheerio'
import request from 'request'
import Helpers from './helpers'

const foundErrors = []

const Crawler = (opts) => {
  let { pages, cb = () => {}, whitelist = [], timeout = 2000 } = opts
  if (!pages) return
  pages = Array.isArray(pages) ? pages : [ pages ]
  if (!pages.length) return cb(new Error('No pages provided'))
  let i = 0
  pages.forEach(page => {
    setTimeout(() => {
      request.post({
        url: page
      }, (err, res, body) => {
        CallBack(err, res, body, page, cb, whitelist)
      })
    }, i)
    i += timeout // Lets wait a few seconds per request - yes i did accidentally DDos them
  })
}

const CallBack = (err, res, body, page, cb, whitelist) => {
  if (err) {
    cb(new Error('Error: ' + err))
    return console.log('Error:', err)
  }
  const fileErrors = []
  const htmlProblems = insecurity.html(body, {passive: true, scripts: true, styles: true, whitelist})

  const $ = cheerio.load(body)
  const stylesheets = $('link[rel=stylesheet]')
  const scripts = $('script[src]')
  htmlProblems.map(htmlError => {
    return fileErrors.push(new Promise(resolve => {
      resolve({ error: htmlError.url + ' - Found in ' + htmlError.tag })
    }))
  })
  stylesheets.each((index, stylesheet) => {
    return fileErrors.push(new Promise(resolve => {
      if (!stylesheet || !$(stylesheet).attr('href')) return resolve()
      const url = Helpers.makeUrl($(stylesheet).attr('href'), page)
      if (foundErrors[url]) return resolve(foundErrors[url])

      request.get({
        url
      }, (err, res, body) => {
        if (err) {
          foundErrors[url] = { log: 'Error processing: ' + url }
          return resolve({ log: 'Error processing: ' + url })
        }
        try {
          const cssProblems = insecurity.css(body, {quiet: true, whitelist})
          if (!cssProblems.length) return resolve()
          const errors = []
          cssProblems.map(cssError => {
            errors.push(cssError.url + ' - ' + cssError.property + ', line: ' + cssError.line)
          })
          foundErrors[url] = { url, errors }
          resolve({ url, errors })
        } catch (e) {
          foundErrors[url] = { log: 'Error processing: ' + url }
          resolve({ log: 'Error processing: ' + url })
        }
      })
    }))
  })
  scripts.each((index, script) => {
    return fileErrors.push(new Promise(resolve => {
      if (!script || !$(script).attr('src')) return resolve()
      const url = Helpers.makeUrl($(script).attr('src'), page)
      if (foundErrors[url]) return resolve(foundErrors[url])

      request.get({
        url
      }, (err, res, body) => {
        if (err) {
          foundErrors[url] = { log: 'Error processing: ' + url }
          return resolve({ log: 'Error processing: ' + url })
        }
        try {
          const jsProblems = insecurity.js(body, {quiet: true, whitelist})
          if (!jsProblems.length) return resolve()
          const errors = []
          jsProblems.map(jsError => {
            errors.push(jsError.url + ' - line: ' + jsError.line)
          })
          foundErrors[url] = { url, errors }
          resolve({ url, errors })
        } catch (e) {
          foundErrors[url] = { log: 'Error processing: ' + url }
          resolve({ log: 'Error processing: ' + url })
        }
      })
    }))
  })

  Promise.all(fileErrors).then(errors => {
    let error = 0
    Helpers.showStat(page)
    errors.map(errorFound => {
      if (!errorFound) return
      if (errorFound.log) return Helpers.showLog(errorFound.log)
      error++
      if (errorFound.error) return Helpers.showError(errorFound.error)
      if (errorFound.url) {
        Helpers.showError(errorFound.url)
        error--
        errorFound.errors.map(errorLink => {
          error++
          Helpers.showError(errorLink, '\t\t')
        })
      }
    })
    if (!error) {
      cb(null, 'success')
      return Helpers.showSuccess('Everything is good!\n')
    }
    cb(new Error('Found ' + error + ' errors!'))
    Helpers.showLog('Found ' + error + ' errors!\n')
  })
}

export default Crawler
