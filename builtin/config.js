var 

path = require('path'),

default_config = {
    port:1337,
    expires : {
        fileMatch: /^(gif|png|jpg|js|css)$/ig,
        maxAge: 60*60*24*365
    },

    filters : ['strict', 'buildtime', 'wrapdefine']
}

default_config.base = path.join(__dirname,"../..");

module.exports = default_config;
