var routes = [
	{name:"icon",          test: /^\/favicon.ico/ },
	{name:"index",         test: /^\/$/ },
    {
        name:"doc.simple",
        test: /^\/doc\/.*\.simple\.html/,
        action: "doc",
        dataGetter: function(){
            return {
                doc: this.position.replace(".simple.html", ".md")
            }
        }
    },
	{
        name:"doc",
        test: /^\/doc\/.*\.html/,
        dataGetter: function(){
            return {
                doc: this.position.replace(".html", ".md")
            }
        }
    },
	{name:"ut",            test: /^\/test\/unit.*\.html/ },
	{name:"utcases",       test: /^\/testcases.json/ }
];

routes["default"] = {name:"neuron"};

module.exports = routes;