var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    proxy = require('selenium-webdriver/proxy');

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
//    .setProxy(proxy.manual({http: 'host:1234'}))
    .forBrowser('chrome')
    .build();

function browseUrlAndClickRandom(url)
{
    try 
    {
        var indx= Math.floor((Math.random() * 10) + 1);
        driver.get(url);
        var xpath = "//*/a["+indx+"]";
        driver.findElement(By.xpath( xpath ) ).click();
        driver.wait( function(){},100000);
    }
    catch(err)
    {
    }
}

driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleIs('webdriver - Google Search'), 1000);

browseUrlAndClickRandom('http://www.tmall.com');
//driver.quit();

browseUrlAndClickRandom('http://news.baidu.com');
//driver.quit();

browseUrlAndClickRandom('http://www.taobao.com');
driver.quit();


