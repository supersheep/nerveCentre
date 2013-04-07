var 

// view = require('../inc/view'),

fs = require('fs'),
tree = require('../../inc/tree'),
mod_path = require('path'),
mod_url = require('url'),
fsutil = require('fs-more');

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


function wrap_code(data){
    return '<script type="text/javascript">' + data + '</script>';
}

function filelist(obj,arr){
    arr = arr || [];
    var path = obj.path;

    if(path.indexOf('.js') > 0 || path.indexOf(".html")>0){
        arr.push(path);
    }
    
    if(obj.children){
        obj.children.forEach(function(child){
            filelist(child,arr);    
        });
    }
    return arr;
}

function ut(req, config){
    var htmlpos = req.position,
        // jscoverage = false,
        jspos = mod_path.join(req.filepath + ".js"),
        // need_coverage = ["jscoverage.html","jstest.dianpingoa.com"],
        dirpos = req.filepath,
        
        filesToConcat,

        content;

    console.log('pos', req.position, req.filepath)


    // function needCoverage(){
    //     return req.headers.referer && need_coverage.some(function(str){
    //         return req.headers.referer.indexOf(str) >= 0;
    //     });
    // }

    // if(needCoverage()){
    //     jscoverage = true;
    // }


    if(fsutil.isFile(htmlpos)){
        content = fs.readFileSync(htmlpos);

        // view.render(req,res,req.route_name,{content:content,jscoverage:jscoverage});
        return {
            content: content
        }
    }

    if(fsutil.isFile(jspos)){
        content = wrap_code(fs.readFileSync(jspos));
        // view.render(req,res,req.route_name,{content:content,jscoverage:jscoverage});

        return {
            content: content
        }
    }

    if(fsutil.isDirectory(dirpos)){

        filesToConcat = filelist(tree.dirTree(dirpos));

        content = concatFiles(filesToConcat,function(data,path){
            return fsutil.isFile(path) && /\.js$/.test(path) ? wrap_code(data) : data;
        },'utf8');

        // view.render(req,res,req.route_name,{content:content,jscoverage:jscoverage});

        return {
            content: content
        }
    }
    
    return {

    }
    // util.write404(req,res);
}

exports.getData = ut;

