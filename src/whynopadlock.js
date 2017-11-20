import cheerio from 'cheerio'
import request from 'request'
import Helpers from './helpers'

const Crawler = (pages, cb) => {
  if (!pages) return
  if (!cb) cb = () => { }
  pages = Array.isArray(pages) ? pages : [ pages ]
  if (!pages.length) return cb(new Error('No pages provided'))
  let i = 0
  pages.forEach(page => {
    setTimeout(() => {
      request.post({
        url: 'https://www.whynopadlock.com/check.php',
        form: {
          url: page,
          Submit: 'Check'
        }
      }, (err, res, body) => {
        CallBack(err, res, body, page, cb)
      })
    }, i)
    i += 3000 // Lets wait 3 seconds per request - yes i did accidentally DDos them
  })
}

const CallBack = (err, res, body, page, cb) => {
  if (err) {
    cb(new Error('Error: ' + err))
    return Helpers.showLog(err)
  }
  Helpers.showStat(page)
  const $ = cheerio.load(body)
  const title = $('#left .entry table tr').first().find('td')
  $('hr', title).replaceWith('')
  $('br', title).replaceWith(', ')
  let text = title.text() + ' :: '
  let html = title.html()
  let error = false

  $('#left .entry table img').each((index, img) => {
    if ($(img).attr('src') !== 'check.PNG') {
      let td = $(img).parents('tr').children().last()
      if (td.text().indexOf('Insecure <form> call. Found on line') >= 0) return
      html += '<hr />' + td.html()
      $('br', td).replaceWith(', ')
      var t = td
        .clone()
        .children('p')
        .remove()
        .end()
        .text()
      text += t
      Helpers.showError(t.split(',')[0])
      $('p', td).each((idx, p) => {
        $('br', $(p)).replaceWith(', ')
        text += $(p).text()
        Helpers.showError($(p).text().split(',')[0])
      })
      error = true
    }
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
