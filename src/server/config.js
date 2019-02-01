const path = require( 'path' );
const exphbs = require( 'express-handlebars' );

const morgan    = require( 'morgan' );
const multer    = require( 'multer' );
const express   = require( 'express' );
const erroHandler = require( 'errorhandler' )
const routes = require( '../routes/index' );

module.exports =  app => {
    //Settings 
    app.set( 'port', process.env.PORT || 3001 );
    app.set( 'views', path.join( __dirname, '../views' ) ); //concatenamos el directorio views
    app.engine( '.hbs', exphbs({
        defaultLayout: 'main',
        partialsDir: path.join(  app.get( 'views' ), 'partials' ),
        layoutsDir: path.join( app.get( 'views' ), 'layouts' ),
        extname: '.hbs',
        helpers: require( './helpers' )
    })); //configuramosd el motor de plantillas
    app.set( 'view engine', '.hbs' ); //utilizar el motor en este caso .hbs

    //Middlewares
    app.use( morgan( 'dev' ) );
    app.use( multer( { dest: path.join( __dirname, '../public/upload/temp' ) } ).single( 'image' ) );
    app.use( express.urlencoded( { extended: false } ) );
    app.use( express.json() );

    //Routes
    routes( app ); //le pasamos routes al archivo indes.js en la carpeta Routes

    //Static Files
    app.use( '/public', express.static( path.join( __dirname, '../public' ) ) );

    //ErrorHandlers
    if ('developmnet' === app.get( 'env' ) ){
        app.use( erroHandler );
    }



    return app;
}