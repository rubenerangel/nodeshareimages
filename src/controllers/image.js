const path      = require( 'path' );
const helpers   = require( '../helpers/libs' );
const fs        = require( 'fs-extra' );
const md5       = require( 'md5' );
// const { randomNumber }   = require( '../helpers/libs' );
// const Image = require( '../models/Images' );
// const { Image } = require( '../models/index' );
const { Image, Comment } = require( '../models' ); //esto es lo mismo que la linea anterior pero mas resumido
const sidebar = require( '../helpers/sidebar' );

const ctrl = {};

ctrl.index = async ( req, res ) => {
    // console.log( 'params: ', req.params.image_id );
    // const image = await Image.findOne( { filename: req.params.image_id } );
    let viewModel = { image:{}, comments: {} };
    const image = await Image.findOne( { filename: { $regex: req.params.image_id } } );
    if ( image ) {
        image.views = image.views + 1;
        viewModel.image = image;
        await image.save();
        const comments = await Comment.find( { image_id: image._id } );
        viewModel.comments = comments;
        viewModel = await sidebar( viewModel );
        res.render('image',  viewModel );
        // res.render('image', { image, comments });
        // console.log( image );
        // Image.find( req.para  );
    } else {
        res.redirect( '/' );
    }
};

ctrl.create = ( req, res ) => {
    const saveImage = async () => {
        // console.log( req.file );
        const imgUrl = helpers.randomNumber() ;
        const images = await Image.find( { filename: imgUrl } );
        if ( images.length > 0 ){
            // imgUrl = randomNumber();
            saveImage();
        } else {
            console.log( imgUrl );
            const imageTempPath = req.file.path;
            const ext = path.extname( req.file.originalname ).toLowerCase();
            const targetPath = path.resolve( `src/public/upload/${imgUrl}${ext}` );
    
            if ( ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' ){
                await fs.rename( imageTempPath, targetPath );
                const newImg = new Image({
                    title: req.body.title,
                    filename: imgUrl + ext,
                    description: req.body.description,
                });
                const imageSaved = await newImg.save();
                // res.send( 'works' );
                res.redirect( `/images/${imgUrl}` );
                // console.log( newImg );
            } else {
                await fs.unlink( imageTempPath );
                res.status( 500 ).json( { error: 'Only Image are Allowed' } );
            }
            // res.send( 'works' );
        }
    };
    saveImage();
};

ctrl.like = async ( req, res ) => {
    const image = await Image.findOne( { filename: { $regex: req.params.image_id } } );
    if ( image ) {
        image.likes = image.likes + 1;
        await image.save();
        res.json( {likes: image.likes } );
    } else {
        res.status(500).json( { error: 'Internal Error' } );
    }
};

ctrl.comment = async ( req, res ) => {
    // console.log( req.body );
    const image = await Image.findOne( { filename:  { $regex: req.params.image_id } } );
    if ( image ) {
        const newComment    = new Comment( req.body );
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id; 
        newComment.save();
        res.redirect( `/images/${ image.uniqueId }` );
        // console.log( newComment );
        // res.send( 'comment' );
    }else {
        res.redirect( '/' );
    }
    // console.log( newComment );
    // console.log( req.params.image_id );
};

ctrl.remove = async ( req, res ) => {
    // console.log(req.params.image_id);
    const image = await Image.findOne( { filename: { $regex: req.params.image_id } } );
    if ( image ) {
        await fs.unlink( path.resolve( './src/public/upload/'+image.filename ) );
        await Comment.deleteOne( { image_id: image._id } );
        await image.remove();
        res.json( true );
    }
};

module.exports = ctrl;
