var fs_more = require('fs-more'),
    util = require('../../inc/util'),
    fs = require('fs'),
    md = require('node-markdown').Markdown;

exports.getData = function(req, config) {
    var doc = req.position.replace(/\.html/, '.md');
    var markdown;

    console.log()

    if( fs_more.isFile( doc ) ){
        var markdown = fs.readFileSync(doc, 'utf8');

        return {
            md: markdown,
            html: md( markdown )
        };

    }else{
        return {}
    }
    
};