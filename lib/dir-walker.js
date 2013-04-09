var fs_more = require('fs-more');
var path = require('path');

function listfilter(origin, root, exclude){
    function dealitem(item){
        var dir = path.dirname(item.path),
            ext = path.extname(item.path),
            basename = path.basename(item.basename,ext);
        item.path = path.join("/",root,dir,basename+".html").replace(/\\/g, "/");
        return item;
    }

    if(origin.children){
        origin.children = origin.children.filter(function(item){
            return !exclude.some(function(regexp){
                return regexp.test(item.name) || regexp.test(item.path);
            });
        });

        origin.children.forEach(function(child){
            child = listfilter(child,root,exclude);
        });
    }

    
    return dealitem(origin);
}

function filelist(dir, dirname){
    var list = fs_more.listSync(dir);

    if(list){
        list = listfilter(list, dirname, [/\.DS_Store/]);
    }else{
        list = [];
    }
    return list;
}


exports.walk = filelist;