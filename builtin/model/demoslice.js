var fs_more = require('fs-more');
var fs = require('fs');

exports.getData = function(req, config) {
    var demo = req.position; // .replace(/\.html/, '.md');
    var markdown;

    console.log('demo', demo);

    if( fs_more.isFile( demo ) ){
        demo = fs.readFileSync(demo, 'utf8');

        return {
            // md: markdown,
            html: demo // md( markdown )
        };

    }else{
        return {}
    }
    
};