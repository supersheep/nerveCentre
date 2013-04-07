var path = require('path');
var fs = require('fs');
var builtin_path = path.join(__dirname, '../builtin');
var REGEX_ENDS_WITH_JS = /\.js$/;


exports.routes = function(config) {
    var file = path.join( config.origin, '.nc', 'routes.js' );
    var builtin_file = path.join( builtin_path, 'routes.js' );
    var file_exports;
    var builtin_file_exports;
    var ret = []

    if( fs.existsSync(builtin_file) ){
        builtin_file_exports = require(builtin_file);
        ret = ret.concat(builtin_file_exports);

        if(builtin_file_exports.default_route){
            ret.default_route = builtin_file_exports.default_route;
        }
    }

    if ( fs.existsSync(file) ) {
        file_exports = require(file);
        ret = ret.concat(file_exports);

        if(file_exports.default_route){
            ret.default_route = file_exports.default_route;
        }
    }

    return ret;
};


exports.model = function(config, name) {
    if(!REGEX_ENDS_WITH_JS.test(name)){
        name += '.js';
    }

    var file = path.join(config.origin, '.nc', 'model', name)
    var builtin_file = path.join(builtin_path, 'model', name)

    if ( fs.existsSync(file) ) {
        return require(file);
    }

    if( fs.existsSync(builtin_file) ){
        return require(builtin_file);
    }
};


exports.rewriteRules = function(config) {
    var file = path.join(config.origin, '.nc', 'rewrite_rules.js')
    var builtin_file = path.join(builtin_path, 'rewrite_rules.js')
    var ret = []

    if( fs.existsSync(builtin_file) ){
        ret = ret.concat(require(builtin_file));
    }

    if ( fs.existsSync(file) ) {
        ret = ret.concat(require(file));
    }

    return ret;

};

exports.action = function(config, name) {
    name = name || 'tpl';

    if(!REGEX_ENDS_WITH_JS.test(name)){
        name += '.js';
    }

    var file = path.join(config.origin, '.nc', 'action', name)
    var builtin_file = path.join(builtin_path, 'action', name)

    if ( fs.existsSync(file) ) {
        return require(file);
    }

    if( fs.existsSync(builtin_file) ){
        return require(builtin_file);
    }
};

exports.templateFile = function(config, name) {
    var dir = path.join(config.origin, config.template);
    var builtin_dir = path.join(builtin_path, 'template');
    var file = path.join(dir, name);
    var builtin_file = path.join(builtin_dir, name);

    if( fs.existsSync(file) ){
        return {
            file: file,
            dir: dir
        }

    }else if( fs.existsSync(builtin_file) ){
        return {
            file: builtin_file,
            dir: builtin_dir
        }

    }else{
        return false;
    }
    
};