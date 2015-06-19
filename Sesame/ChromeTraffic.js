var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    proxy = require('selenium-webdriver/proxy');

var TopSites = require('./Top50ChinaSites');

webdriver.promise.controlFlow().on('uncaughtException', function(e) {
    console.error('Unhandled error: ' + e);
});

var topSites= TopSites.TopSites;
console.log('Top Sites: '+topSites.length);

var nVisitingSites = 0;
var proxy_server = '';

function testUrl()
{

    var randomSite = Math.floor( Math.random()*(topSites.length-1) );
    url = topSites[ randomSite ];
    
    console.log("testing url: ["+randomSite+"] ="+url);

    var driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        setProxy(proxy.manual({http: proxy_server})).
        build();
        
    try {   
        driver.get(url)
        .then(
            function(){ return driver.getTitle().then(function(title){console.log(title);}); }
        )
        ;        
        var xp="//a[starts-with(@href, 'http')]";
        var links = driver.findElements(webdriver.By.xpath(xp));
        links  //links from the page read;
        .then(
            function(arrlink)  {
                if( arrlink && arrlink.length>0 )  {
                    var rind = Math.floor( Math.random()*(arrlink.length-1) );                     
                    var elclick=arrlink[rind];
                    console.log( 'clicking '+rind+'th element link out of ' + arrlink.length +' links');
                    var action= new webdriver.ActionSequence(driver);
                    action.mouseMove(elclick);
                    action.click();
                    return action.perform();
                }
            }
        )        
        .then(
            function(actperform){ 
                driver.executeScript('return document.readyState', 10000);
                return driver.getTitle().then(function(title){console.log(title);}); 
            }
        )
        .then(
            function()
            {
                driver.quit();
                testUrl();
            }
        )
     }
    catch(err) {
        console.log(err);
    }
    finally {
    	driver.quit();
    	// testUrl();
	}	
}

function main() {

    // check for any command line arguments
    for (var argn = 2; argn < process.argv.length; argn++) {
        if (process.argv[argn] === '-p') {
            proxy_server = process.argv[argn + 1];
            argn++;
            continue;
        }
    }

    if(proxy_server.length <= 0){
        console.log('Proxy Server Address is set empty, exit ...');
        return;
    }

    testUrl();
}

main();
// node ChromeTraffic -p 'xxx.xxx.xxx.xxx:xxxx';  ex:'10.104.61.158:7899'

