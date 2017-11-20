import insecurity from 'insecurity'
import cheerio from 'cheerio'
import request from 'request'
import Helpers from './helpers'

const Crawler = (opts) => {
  let { pages, cb = () => {}, whitelist = [], timeout = 3000 } = opts
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
    i += timeout // Lets wait 3 seconds per request - yes i did accidentally DDos them
  })
}

const CallBack = (err, res, body, page, cb, whitelist) => {
  if (err) {
    cb(new Error('Error: ' + err))
    return console.log('Error:', err)
  }
  Helpers.showStat(page)
  let error = false
  const html = ''
  const text = ''
  const htmlProblems = insecurity.html(body, {passive: true, scripts: true, styles: true, whitelist})

  const $ = cheerio.load(body)
  const stylesheets = $('link[rel=stylesheet]')
  const scripts = $('script[src]')
  htmlProblems.map(htmlError => {
    Helpers.showError(htmlError.url + ' - Found in ' + htmlError.tag)
    error = 1
  })
  stylesheets.each((index, stylesheet) => {
    if (!stylesheet || !$(stylesheet).attr('href')) return
    const url = Helpers.makeUrl($(stylesheet).attr('href'), page)

    request.get({
      url
    }, (err, res, body) => {
      if (err) return Helpers.showLog('Error processing: ' + url)
      try {
        const cssProblems = insecurity.css(body, {quiet: true, whitelist})
        if (!cssProblems.length) return
        Helpers.showError(url)
        cssProblems.map(cssError => {
          Helpers.showError(cssError.url + ' - ' + cssError.property + ', line: ' + cssError.line, '\t\t')
        })
        error = 1
      } catch (e) {
        Helpers.showLog('Error processing: ' + url)
      }
    })
  })
  scripts.each((index, script) => {
    if (!script || !$(script).attr('src')) return
    const url = Helpers.makeUrl($(script).attr('src'), page)

    request.get({
      url
    }, (err, res, body) => {
      if (err) return Helpers.showLog('Error processing: ' + url)
      try {
        const jsProblems = insecurity.js(body, {quiet: true, whitelist})
        if (!jsProblems.length) return
        Helpers.showError(url)
        jsProblems.map(jsError => {
          Helpers.showError(jsError.url + ' - line: ' + jsError.line, '\t\t')
        })
        error = 1
      } catch (e) {
        Helpers.showLog('Error processing: ' + url)
      }
    })
  })

  if (!error) {
    cb(null, 'success')
    return Helpers.showSuccess('Everything is good!')
  }
  console.log('') // Display blank line

  var mailOptions = {
    from: '',
    to: '',
    subject: 'HTTPS Warnings  - ' + page,
    text: text,
    html: html
  }
  Helpers.sendMail(mailOptions)
  return cb(null, 'success')
}

export default Crawler
