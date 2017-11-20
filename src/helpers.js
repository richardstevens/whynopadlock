import nodemailer from 'nodemailer'
import colors from 'colors'
import urlParse from 'url-parse'

const Helpers = {
  showStat: (page) => {
    const time = new Date()
    let timeDisplay = ('0' + time.getHours()).slice(-2) + ':'
    timeDisplay += ('0' + time.getMinutes()).slice(-2) + ':'
    timeDisplay += ('0' + time.getSeconds()).slice(-2)
    console.log('[' + colors.cyan(timeDisplay) + ']', colors.yellow(page))
  },

  showLog: (message) => {
    if (!message) return
    console.log(colors.grey(message))
  },

  showError: (error, indent = '\t') => {
    if (!error) return
    console.log(indent + '❌  ' + colors.red(error))
  },

  showSuccess: (message, indent = '\t') => {
    if (!message) return
    console.log(indent + '🍻  ' + colors.green(message))
  },

  makeUrl: (href, page) => {
    if (href.slice(0, 2) === '//') href = 'https:' + href
    const { hostname } = urlParse(page, true)
    if (href.slice(0, 1) === '/') href = 'https://' + hostname + '/' + href
    return href
  },

  // create reusable transporter object using SMTP transport
  transporter: () => {
    nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '',
        pass: ''
      }
    })
  },

  sendMail: (opts, transporter) => {
    /* if (!opts) return
    if (!transporter) return
    transporter.sendMail( opts, ( error, info ) => {
      if ( error ) console.log( error )
      else console.log( 'Message sent: ' + info.response )
    }) */
  }
}

export default Helpers
