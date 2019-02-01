const { Comment, Image } = require( '../models' );

async function imagesCounter() {
    return await Image.countDocuments();
};

async function commentsCounter() {
    return await Comment.countDocuments();
};

async function imageTotalViewsCounter() {
     const views = await Image.aggregate([{ 
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' }
        }
     }])
     return views[0].viewsTotal;
};

async function likesTotalCounter() {
    const likes = await Image.aggregate([{ 
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes' }
        }
     }])
     return likes[0].likesTotal;
};


module.exports = async () => {
    const results = await Promise.all([
        imagesCounter(),
        commentsCounter(),
        imageTotalViewsCounter(),
        likesTotalCounter()
    ]);

    return {
        images: results[0],
        comments: results[1],
        totalViews: results[2],
        totalLikes: results[3],
    }
};