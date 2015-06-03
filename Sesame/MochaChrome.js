var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');

function testUrl(url)
{
    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build(); 
    try {   
        driver.get(url);
        var searchBox = driver.findElement(webdriver.By.name('q'));
        searchBox.sendKeys('simple programmer');
        searchBox.getAttribute('value').then(function(value) {
          assert.equal(value, 'simple programmer');
        });
    }
    catch(err) {
        console.log(err);
    }
    finally {
    	driver.quit();
	}
}

test.describe('Google Search', function() {
  test.it('should work', function() { testUrl('http://www.google.com'); });
});
