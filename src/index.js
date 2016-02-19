import cheerio from 'cheerio';
import request from 'request';
import nodemailer from 'nodemailer';
import colors from 'colors';

const Crawler = ( pages, cb ) => {
  if ( !pages ) return;
  if ( !cb ) cb = ( ) => { };
  pages = Array.isArray( pages ) ? pages : [ pages ];
  let i = 0;
  pages.forEach( page => {
    setTimeout( ( ) => {
      request.post( {
        url: 'https://www.whynopadlock.com/check.php',
        form: {
          url: page,
          Submit: 'Check'
        }
      }, ( err, res, body ) => {
        Crawler.callBack( err, res, body, page, cb );
      } );
    }, i );
    i += 3000; // Lets wait 3 seconds per request - yes i did accidentally DDos them
  } );
};

const showStat = ( page ) => {
  const time = new Date( );
  let timeDisplay = ('0' + time.getHours()).slice(-2) + ':';
  timeDisplay += ('0' + time.getMinutes()).slice(-2) + ':';
  timeDisplay += ('0' + time.getSeconds()).slice(-2);
  console.log( '[' + colors.cyan( timeDisplay ) + ']', colors.yellow( page ));
};

const showError = ( error ) => {
  if ( !error ) return;
  console.log( '\t' + '❌  ' + colors.red( error ));
};

// create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport( {
  service: 'Gmail',
  auth: {
    user: '',
    pass: ''
  }
} );

const sendMail = ( opts ) => {
  if ( !opts ) return;
  if ( !transporter ) return;
  /*transporter.sendMail( opts, ( error, info ) => {
    if ( error ) console.log( error );
    else console.log( 'Message sent: ' + info.response );
  } );*/
};

Crawler.callBack = ( err, res, body, page, cb ) => {
  if ( err ) {
    cb( );
    return console.log( err );
  }
  showStat( page );
  const $ = cheerio.load( body );
  const title = $( '#left .entry table tr' ).first( ).find( 'td' );
  $( 'hr', title).replaceWith( '' );
  $( 'br', title).replaceWith( ', ' );
  let text = title.text( ) + ' :: ';
  let html = title.html( );
  let error = false;

  $( '#left .entry table img' ).each( ( index, img ) => {
    if ( $( img ).attr( 'src' ) !== 'check.PNG' ) {
      let td = $( img ).parents( 'tr' ).children( ).last( );
      if ( td.text( ).indexOf( 'Insecure <form> call. Found on line' ) >= 0 ) return;
      html += '<hr />' + td.html( );
      $( 'br', td ).replaceWith( ', ' );
      var t = td
        .clone( )
        .children( 'p' )
        .remove( )
        .end( )
        .text( );
      text += t;
      showError( t.split( ',' )[0] );
      $( 'p', td ).each( ( idx, p ) => {
        $( 'br', $( p ) ).replaceWith( ', ' );
        text += $( p ).text( );
        showError( $( p ).text( ).split( ',' )[0] );
      } );
      error = true;
    }
  } );

  if ( !error ) {
    cb( );
    return console.log( '\t' + '🍻  ' + colors.green( 'Everything is good!' ));
  }
  console.log( '' ); // Display blank line

  var mailOptions = {
    from: '',
    to: '',
    subject: 'HTTPS Warnings  - ' + page,
    text: text,
    html: html
  };
  sendMail( mailOptions );
  cb( );
};

export default Crawler;
