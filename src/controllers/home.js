const ctrl = {};

// const { Image } = require( '../models/index' );
const { Image } = require( '../models/' );
const sidebar = require( '../helpers/sidebar' );

ctrl.index = async ( req,res ) => {
    // res.send( 'Index page whit controllers' );
    const images = await Image.find().sort( { timestamp: -1 } );
    let viewModel = { images: [] };
    viewModel.images = images;
    viewModel = await sidebar( viewModel );
    // console.log( viewModel );
    console.log( viewModel.sidebar.comments[0].image );
    // res.render( 'index', {images} );
    res.render( 'index', viewModel );
};

module.exports = ctrl;
