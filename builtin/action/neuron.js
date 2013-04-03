var fs = require('fs');
var url = require('url');
var mod_path = require('path');
var fs_more = require('fs-more');
var filters = require('./neuron/filters');

var REGEX_IS_JS = /\.js$/;


// filter data with custom filters
function filterData(req, data){   
    var filter_arr = req.config.filters || [],
        url = req.originurl;

    filter_arr.forEach(function(filter){
        if(filters[filter]){
            data = filters[filter](data, url, req);
        }
    });
    
    return data;    

}

// 合并文件
function concatFiles(arr,fn,encode){
    var sum = '';
    var dataTemp;
    arr.forEach(function(path){
        try{
        dataTemp = fs.readFileSync(path,encode||'binary');
        if(fn){
            dataTemp = fn(dataTemp,path);
        }
        sum += dataTemp + '\n';
        }catch(e){
        }
    });
    return sum;
}


function neuron_static(req, config){
    var pathname = req.pathname, // /a/b/c.js
        position = req.position, // /home/spud/a/b/c.js
        libbase = config.libbase, // support multi libbase later
        dirpath = mod_path.dirname(position), // /home/spud/a/b
        coverage_libbase = config.jscoverage_libbase,
        extname  = mod_path.extname(position); // .js

    if(coverage_libbase && new RegExp(coverage_libbase).test(pathname)){
        libbase = coverage_libbase;
    }
    
    function try_from_build(){
        var build_file_path = mod_path.join(dirpath,"build.json"),
            basename = mod_path.basename(position);

        if(!fs.existsSync(build_file_path)){
            return false;
        }

        try{
            var concats = JSON.parse(fs.readFileSync(build_file_path)).concat;
        }catch(e){
            return false;
        }


        var concat = concats.filter(function(data){
            return data.output === basename;
        })[0];


        if(!concat){
            return false;
        }

        var toconcat = concat.path.map(function(subpath){
            return mod_path.join(config.origin,libbase,concat.folder,subpath);
        });

        filedata = concatFiles(toconcat);
        filedata = filterData(req,filedata);

        return {
            status: 200,
            data: filedata
        };
    }

    function try_from_dir(){
        var toconcat,
            filedata,

            basename  = mod_path.basename(position,extname), // c
            path_with_same_name = mod_path.join(dirpath,basename); // /home/spud/a/b/c
        
        if(!fs_more.isDirectory(path_with_same_name)){
            return false;
        }

        if(!pathname.match(libbase)){
            return false;
        }

        toconcat = fs.readdirSync(path_with_same_name).filter(function(e){
            return mod_path.extname(e) === extname;
        }).map(function(e){
            return mod_path.join(dirpath,basename,e);
        });


        filedata = "NR.define.on();\n";
        filedata += concatFiles(toconcat,function(file,p){
            var moduleBase = p.split(config.libbase)[0], // /Users/spud/Neuron/branch/neuron/
                moduleName = p.split(moduleBase)[1]; // /lib/1.0/switch/core.js
                
            return file.replace(/(KM|NR)\.define\(/,"NR.define('" + moduleName + "',") + "\n";
        });
        filedata += "NR.define.off();";
        
        return {
            status: 200,
            data: filedata
        }
    }

    function try_from_static(){

        if(!fs_more.isFile(position)){
            return {
                status: 404
            }
        }

        var filedata = fs.readFileSync(position,'binary');

        if(fs_more.isFile(position) && REGEX_IS_JS.test(position) ){
            filedata = filterData(req,filedata);
        }

        return {
            status: 200,
            data: filedata
        }
    }

    return try_from_build() || try_from_dir() || try_from_static();
}

exports.render = function(info) {
    return neuron_static(info.data.req, info.data.config);
};