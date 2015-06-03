
var webdriver = require('selenium-webdriver');

webdriver.promise.controlFlow().on('uncaughtException', function(e) {
    console.error('Unhandled error: ' + e);
});


function testUrl(url)
{
    var driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
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
                    action.click(elclick).perform();
                    return action;
                }
            }
        )
        .then(
            function(actperform){ 
                for(x in actperform)
                    console.log(x);
                return driver.getTitle().then(function(title){console.log(title);}); 
            }
        );
     }
    catch(err) {
        console.log(err);
    }
    finally {
    	driver.quit();
	}
}

testUrl('http://news.baidu.com'); 
testUrl('http://www.qq.com'); 
testUrl('http://www.taobao.com'); 
testUrl('http://www.tmall.com'); 
//driver.quit();
