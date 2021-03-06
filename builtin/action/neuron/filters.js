var uglifyjs = require('uglify-js');
var url = require('url');
var wrapdefine = require('./filters/wrapdefine');


var filters = {

    wrapdefine: wrapdefine,

    // use uglify to compress .min files
    uglify: function (origin, url) {

        if (url.match(/\.min.*\.(js|css)$/)) {
            try {
                var jsp = uglifyjs.parser;
                var pro = uglifyjs.uglify;
                var ast = jsp.parse(origin);
                var finalcode;

                ast = pro.ast_mangle(ast);
                ast = pro.ast_squeeze(ast);
                final_code = pro.gen_code(ast);
                return final_code;

            } catch (e) {
                log.error('uglify', e);
                return origin;
            }

        } else {
            return origin;
        }
    },

    proxycomment: function (origin, uri) {
        var parsed = url.parse(uri, true),
            from = parsed.query.from,
            to = parsed.pathname;

        var comment = "/**\n" + " * Proxy Info\n" + " * From: " + from + "\n" + " * To:   " + to + "\n" + " */\n";

        return comment + origin;
    },

    // replace the fake %buidtime%
    buildtime: function (origin, url) {
        var date = new Date();
        var timestr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + fill(date.getHours()) + ":" + fill(date.getMinutes()) + ":" + fill(date.getSeconds());

        function fill(s) {
            return s.toString().length < 2 ? ("0" + s) : s;
        }
        return origin.replace(/%buildtime%/g, timestr);
    },
    // add use strict on top of the script
    strict: function (origin, url) {
        function inlibpath(url) {
            /* for(var i = 0,l=config.libpath.length;i<l;i++){			
				if(url.match(config.libpath[i])){
					return true;
				}
			}*/
            return false;
        }

        function incoverage(url) {
            return url.match("/jscoverage_lib/");
        }

        function need_strict(url) {
            return inlibpath(url) && !incoverage(url);
        }

        return need_strict(url) ? ("\"use strict\";\r\n" + origin) : origin;
    } // ,

    // replace the fake branch
    // branch: function (origin, uri) {
    //     var match, base, ret,
    //         parsed = url.parse(uri, true),
    //         pathname = parsed.pathname,
    //         query = parsed.query,
    //         from = query.from,
    //         REG_BRANCH_OR_TRUNK = /(?:branch\/[^\/]*|trunk)\//,
    //         REG_BRANCH_BASE = /\/\*branch-base\*\/'([^']*)'/g,
    //         PATH_NEURON = /\/neuron[^.]*\.js$/.test(pathname),
    //         FROM_APP_NEURON = /\/neuron[^.]*\.js$/.test(from),
    //         USE_PROXY = false; //config.useproxy;


    //     // 若非代理过来，且来自为neuron.js，base为请求的前缀
    //     if (!USE_PROXY && PATH_NEURON) {
    //         base = pathname.match(REG_BRANCH_OR_TRUNK);
    //         base = base ? base[0] : "";
    //         ret = origin.replace(REG_BRANCH_BASE, '\'' + base + '\'');
    //         // 若是请求其他分支的neuron.js，base为from路径的前缀
    //     } else if (USE_PROXY && FROM_APP_NEURON) {
    //         match = from.match(REG_BRANCH_OR_TRUNK);
    //         base = match && match[0] || "";
    //         ret = origin.replace(REG_BRANCH_BASE, '\'' + base + '\'');
    //     } else {
    //         ret = origin;
    //     }

    //     return ret;
    // }
}

module.exports = filters;