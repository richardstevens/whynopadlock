import chai from 'chai';
import chaiLint from 'chai-lint';
chai.use( chaiLint );
const { expect } = chai;
import crawler from '../lib/index';
import sinon from 'sinon';
const sandbox = sinon.sandbox.create( );


describe('Crawler', ( ) => {
  let files;

  beforeEach( ( ) => {
    files = [
      'https://www.google.com/'
    ];
    sandbox.stub( crawler, 'callBack' );
  });

  afterEach( ( ) => {
    sandbox.restore( );
  } );

  it( 'everything should match', done => {
    expect( files ).to.be.a( 'array' );
    expect( crawler ).to.be.a( 'function' );
    done( );
  } );

  it( 'should allow to be called', done => {
    const cb = ( ) => {
      console.log( 'here' );
      expect( crawler.callBack ).to.have.beenCalledOnce( );
      done( );
    };
    crawler( files, cb );
  } );

  it( 'should return blank if no files', done => {
    crawler( [ ], done );
    expect( crawler.callBack ).to.have.beenCalledOnce( );
  } );
});
