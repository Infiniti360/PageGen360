console.log('Popup script loaded');

document.getElementById('scan').addEventListener('click', async () => {
  console.log('Scan button clicked');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Current tab:', tab);
    
    const output = document.getElementById('output');
    const stats = document.getElementById('stats');
    const elementCount = document.getElementById('elementCount');
    const pageInfo = document.getElementById('pageInfo');
    
    output.textContent = 'Scanning page...';
    stats.style.display = 'none';
    
    chrome.runtime.sendMessage({ type: 'SCAN_PAGE' }, (response) => {
      console.log('Received response:', response);
      
      if (response && response.error) {
        output.textContent = `❌ Error: ${response.error}`;
        return;
      }
      
      if (response && response.selectors && Object.keys(response.selectors).length > 0) {
        console.log('Generating POM file...');
        const pageName = tab.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        console.log('Page name:', pageName);
        
        // Get selected language
        const language = document.getElementById('language').value;
        console.log('Selected language:', language);
        
        const pomContent = generatePageObject(response, pageName, language);
        console.log('POM content generated');
        
        // Show enhanced statistics
        stats.style.display = 'block';
        elementCount.textContent = `Found ${response.interactiveElements} interactive elements out of ${response.totalElements} total elements`;
        pageInfo.textContent = `Page: ${response.pageTitle}`;
        
        // Create and download the file
        try {
          let fileExtension = '.ts';
          if (language === 'java') fileExtension = '.java';
          else if (language === 'python') fileExtension = '.py';
          else if (['webdriverio', 'playwright', 'puppeteer', 'protractor', 'nightwatch'].includes(language)) fileExtension = '.js';
          else if (['typescript-webdriverio', 'typescript-playwright', 'typescript-puppeteer', 'typescript-protractor', 'typescript-nightwatch'].includes(language)) fileExtension = '.ts';
          else if (['python-playwright', 'python-webdriverio'].includes(language)) fileExtension = '.py';
          else if (['cucumber-java', 'gauge-java'].includes(language)) fileExtension = '.java';
          else if (['cucumber-javascript', 'gauge-javascript'].includes(language)) fileExtension = '.js';
          else if (['cucumber-python', 'behave-python'].includes(language)) fileExtension = '.py';
          else if (language === 'specflow-csharp') fileExtension = '.cs';
          else if (language === 'robot-framework') fileExtension = '.robot';
          
          const blob = new Blob([pomContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${pageName}${fileExtension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          output.textContent = `✅ POM file generated and downloaded!\n\nLanguage: ${language.toUpperCase()}\nFile: ${pageName}${fileExtension}\nInteractive Elements: ${response.interactiveElements}\nTotal Elements Scanned: ${response.totalElements}`;
          console.log('File download initiated');
        } catch (downloadError) {
          console.error('Download error:', downloadError);
          output.textContent = `❌ Error downloading file: ${downloadError.message}`;
        }
      } else {
        output.textContent = '❌ No interactive elements found to generate POM\n\nThis might be because:\n- The page is not fully loaded\n- The page has no interactive elements\n- There was an error scanning the page';
      }
    });
  } catch (error) {
    console.error('Error in scan process:', error);
    const output = document.getElementById('output');
    output.textContent = `Error: ${error.message}`;
  }
});

// POM generation function (imported from generator.ts)
function generatePageObject(data, pageName, language = 'typescript') {
  console.log('Generating POM for:', pageName, 'with language:', language);
  
  // This function will be replaced by the actual generator functions
  // For now, we'll use a simple implementation
  const className = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page`;
  const methods = Object.entries(data.selectors).map(([key, elementData]) => {
    const methodName = elementData.methodName;
    let methodBody = '';
    
    if (language === 'typescript') {
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `    cy.get('${elementData.selector}').click();`;
        } else {
          methodBody = `    cy.get('${elementData.selector}').type(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `    cy.get('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `    cy.get('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `    cy.get('${elementData.selector}').select(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `    cy.get('${elementData.selector}').click();`;
      } else {
        methodBody = `    cy.get('${elementData.selector}').click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value: string' : '';
      
      return `  ${methodName}(${param}) {
${methodBody}
  }`;
    } else if (language === 'java') {
      const fieldName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        ${fieldName}.click();`;
        } else {
          methodBody = `        ${fieldName}.sendKeys(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        ${fieldName}.click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        ${fieldName}.click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        new Select(${fieldName}).selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        ${fieldName}.click();`;
      } else {
        methodBody = `        ${fieldName}.click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'String value' : '';
      
      return `    public void ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'python') {
      const fieldName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
        } else {
          methodBody = `        self.driver.find_element(*self.${fieldName}).send_keys(value)`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        Select(self.driver.find_element(*self.${fieldName})).select_by_visible_text(value)`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      } else {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'self, value' : 'self';
      
      return `    def ${methodName}(${param}):
        """${methodName} method"""
${methodBody}`;
    } else if (language === 'python-playwright') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        self.page.click('${elementData.selector}')`;
        } else {
          methodBody = `        self.page.fill('${elementData.selector}', value)`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        self.page.click('${elementData.selector}')`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        self.page.click('${elementData.selector}')`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        self.page.select_option('${elementData.selector}', value)`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        self.page.click('${elementData.selector}')`;
      } else {
        methodBody = `        self.page.click('${elementData.selector}')`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'self, value' : 'self';
      
      return `    def ${methodName}(${param}):
        """${methodName} method"""
${methodBody}`;
    } else if (language === 'python-webdriverio') {
      const fieldName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
        } else {
          methodBody = `        self.driver.find_element(*self.${fieldName}).send_keys(value)`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        Select(self.driver.find_element(*self.${fieldName})).select_by_visible_text(value)`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      } else {
        methodBody = `        self.driver.find_element(*self.${fieldName}).click()`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'self, value' : 'self';
      
      return `    def ${methodName}(${param}):
        """${methodName} method"""
${methodBody}`;
    } else if (language === 'cucumber-python' || language === 'behave-python') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}').click()`;
        } else {
          methodBody = `        self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}').send_keys(value)`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}').click()`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}').click()`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        Select(self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}')).select_by_visible_text(value)`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}').click()`;
      } else {
        methodBody = `        self.driver.find_element(By.CSS_SELECTOR, '${elementData.selector}').click()`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'self, value' : 'self';
      
      return `    @when('I ${methodName.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}')
    def ${methodName}(${param}):
        """${methodName} step definition"""
${methodBody}`;
    } else if (language === 'webdriverio') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        $('${elementData.selector}').click();`;
        } else {
          methodBody = `        $('${elementData.selector}').setValue(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        $('${elementData.selector}').selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        $('${elementData.selector}').click();`;
      } else {
        methodBody = `        $('${elementData.selector}').click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'playwright') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        await this.page.click('${elementData.selector}');`;
        } else {
          methodBody = `        await this.page.fill('${elementData.selector}', value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        await this.page.selectOption('${elementData.selector}', value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    async ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'puppeteer') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        await this.page.click('${elementData.selector}');`;
        } else {
          methodBody = `        await this.page.type('${elementData.selector}', value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        await this.page.select('${elementData.selector}', value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    async ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'protractor') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        element(by.css('${elementData.selector}')).click();`;
        } else {
          methodBody = `        element(by.css('${elementData.selector}')).sendKeys(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'nightwatch') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        browser.click('${elementData.selector}');`;
        } else {
          methodBody = `        browser.setValue('${elementData.selector}', value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else {
        methodBody = `        browser.click('${elementData.selector}');`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'typescript-webdriverio') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        $('${elementData.selector}').click();`;
        } else {
          methodBody = `        $('${elementData.selector}').setValue(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        $('${elementData.selector}').selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        $('${elementData.selector}').click();`;
      } else {
        methodBody = `        $('${elementData.selector}').click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value: string' : '';
      
      return `    ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'typescript-playwright') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        await this.page.click('${elementData.selector}');`;
        } else {
          methodBody = `        await this.page.fill('${elementData.selector}', value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        await this.page.selectOption('${elementData.selector}', value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value: string' : '';
      
      return `    async ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'typescript-puppeteer') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        await this.page.click('${elementData.selector}');`;
        } else {
          methodBody = `        await this.page.type('${elementData.selector}', value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        await this.page.select('${elementData.selector}', value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      } else {
        methodBody = `        await this.page.click('${elementData.selector}');`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value: string' : '';
      
      return `    async ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'typescript-protractor') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        element(by.css('${elementData.selector}')).click();`;
        } else {
          methodBody = `        element(by.css('${elementData.selector}')).sendKeys(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      } else {
        methodBody = `        element(by.css('${elementData.selector}')).click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value: string' : '';
      
      return `    ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'typescript-nightwatch') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        browser.click('${elementData.selector}');`;
        } else {
          methodBody = `        browser.setValue('${elementData.selector}', value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        browser.click('${elementData.selector}');`;
      } else {
        methodBody = `        browser.click('${elementData.selector}');`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value: string' : '';
      
      return `    ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'cucumber-java') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
        } else {
          methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).sendKeys(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        new Select(driver.findElement(By.cssSelector("${elementData.selector}"))).selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      } else {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'String value' : '';
      
      return `    @When("I ${methodName.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}")
    public void ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'cucumber-javascript') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        await $('${elementData.selector}').click();`;
        } else {
          methodBody = `        await $('${elementData.selector}').setValue(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        await $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        await $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        await $('${elementData.selector}').selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        await $('${elementData.selector}').click();`;
      } else {
        methodBody = `        await $('${elementData.selector}').click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    When('I ${methodName.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}', async function(${param}) {
${methodBody}
    });`;
    } else if (language === 'specflow-csharp') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `            driver.FindElement(By.CssSelector("${elementData.selector}")).Click();`;
        } else {
          methodBody = `            driver.FindElement(By.CssSelector("${elementData.selector}")).SendKeys(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `            driver.FindElement(By.CssSelector("${elementData.selector}")).Click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `            driver.FindElement(By.CssSelector("${elementData.selector}")).Click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `            new SelectElement(driver.FindElement(By.CssSelector("${elementData.selector}"))).SelectByText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `            driver.FindElement(By.CssSelector("${elementData.selector}")).Click();`;
      } else {
        methodBody = `            driver.FindElement(By.CssSelector("${elementData.selector}")).Click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'string value' : '';
      
      return `    [When(@"I ${methodName.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}")]
    public void ${methodName}(${param})
    {
${methodBody}
    }`;
    } else if (language === 'robot-framework') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `    Click Element    ${elementData.selector}`;
        } else {
          methodBody = `    Input Text    ${elementData.selector}    \${value}`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `    Click Element    ${elementData.selector}`;
      } else if (elementData.elementType === 'a') {
        methodBody = `    Click Element    ${elementData.selector}`;
      } else if (elementData.elementType === 'select') {
        methodBody = `    Select From List By Label    ${elementData.selector}    \${value}`;
      } else if (elementData.elementType === 'img') {
        methodBody = `    Click Element    ${elementData.selector}`;
      } else {
        methodBody = `    Click Element    ${elementData.selector}`;
      }
      
      return `${methodName}
${methodBody}`;
    } else if (language === 'gauge-java') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
        } else {
          methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).sendKeys(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        new Select(driver.findElement(By.cssSelector("${elementData.selector}"))).selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      } else {
        methodBody = `        driver.findElement(By.cssSelector("${elementData.selector}")).click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'String value' : '';
      
      return `    @Step("I ${methodName.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}")
    public void ${methodName}(${param}) {
${methodBody}
    }`;
    } else if (language === 'gauge-javascript') {
      let methodBody = '';
      
      if (elementData.elementType === 'input') {
        const type = elementData.attributes.type;
        if (type === 'checkbox' || type === 'radio') {
          methodBody = `        await $('${elementData.selector}').click();`;
        } else {
          methodBody = `        await $('${elementData.selector}').setValue(value);`;
        }
      } else if (elementData.elementType === 'button') {
        methodBody = `        await $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'a') {
        methodBody = `        await $('${elementData.selector}').click();`;
      } else if (elementData.elementType === 'select') {
        methodBody = `        await $('${elementData.selector}').selectByVisibleText(value);`;
      } else if (elementData.elementType === 'img') {
        methodBody = `        await $('${elementData.selector}').click();`;
      } else {
        methodBody = `        await $('${elementData.selector}').click();`;
      }
      
      const param = elementData.elementType === 'input' && elementData.attributes.type !== 'checkbox' && elementData.attributes.type !== 'radio' ? 'value' : '';
      
      return `    step("I ${methodName.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}", async function(${param}) {
${methodBody}
    });`;
    }
  });

  if (language === 'typescript') {
    return `// ${pageName}.ts
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

export class ${className} {
  visit() {
    cy.visit('${data.pageUrl}');
  }

${methods.join('\n\n')}
}`;
  } else if (language === 'java') {
    return `// ${pageName}.java
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

public class ${className} {
    
    private WebDriver driver;
    
    public ${className}(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
    
    // Page URL
    public void navigateTo() {
        driver.get("${data.pageUrl}");
    }
    
    // Page methods
${methods.join('\n\n')}
}`;
  } else if (language === 'python') {
    return `# ${pageName}.py
# Generated POM for: ${data.pageTitle}
# URL: ${data.pageUrl}
# Total elements found: ${data.totalElements}
# Interactive elements found: ${data.interactiveElements}

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class ${className}:
    """Page Object Model for ${data.pageTitle}"""
    
    def __init__(self, driver):
        self.driver = driver
        self.url = "${data.pageUrl}"
    
    def navigate_to(self):
        """Navigate to the page"""
        self.driver.get(self.url)
    
    # Page methods
${methods.join('\n\n')}`;
  } else if (language === 'python-playwright') {
    return `# ${pageName}.py
# Generated POM for: ${data.pageTitle}
# URL: ${data.pageUrl}
# Total elements found: ${data.totalElements}
# Interactive elements found: ${data.interactiveElements}

from playwright.sync_api import Page


class ${className}:
    """Page Object Model for ${data.pageTitle}"""
    
    def __init__(self, page: Page):
        self.page = page
        self.url = "${data.pageUrl}"
    
    def navigate_to(self):
        """Navigate to the page"""
        self.page.goto(self.url)
    
    # Page methods
${methods.join('\n\n')}`;
  } else if (language === 'python-webdriverio') {
    return `# ${pageName}.py
# Generated POM for: ${data.pageTitle}
# URL: ${data.pageUrl}
# Total elements found: ${data.totalElements}
# Interactive elements found: ${data.interactiveElements}

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select


class ${className}:
    """Page Object Model for ${data.pageTitle}"""
    
    def __init__(self, driver):
        self.driver = driver
        self.url = "${data.pageUrl}"
    
    def navigate_to(self):
        """Navigate to the page"""
        self.driver.get(self.url)
    
    # Page methods
${methods.join('\n\n')}`;
  } else if (language === 'cucumber-python') {
    return `# ${pageName}_steps.py
# Generated Cucumber Step Definitions for: ${data.pageTitle}
# URL: ${data.pageUrl}
# Total elements found: ${data.totalElements}
# Interactive elements found: ${data.interactiveElements}

from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select


class ${className}Steps:
    """Cucumber Step Definitions for ${data.pageTitle}"""
    
    def __init__(self, driver):
        self.driver = driver
        self.url = "${data.pageUrl}"
    
    # Step definitions
${methods.join('\n\n')}`;
  } else if (language === 'behave-python') {
    return `# ${pageName}_steps.py
# Generated Behave Step Definitions for: ${data.pageTitle}
# URL: ${data.pageUrl}
# Total elements found: ${data.totalElements}
# Interactive elements found: ${data.interactiveElements}

from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select


class ${className}Steps:
    """Behave Step Definitions for ${data.pageTitle}"""
    
    def __init__(self, driver):
        self.driver = driver
        self.url = "${data.pageUrl}"
    
    # Step definitions
${methods.join('\n\n')}`;
  } else if (language === 'webdriverio') {
    return `// ${pageName}.js
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

class ${className} {
    constructor() {
        this.url = "${data.pageUrl}";
    }
    
    visit() {
        browser.url(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

module.exports = new ${className}();`;
  } else if (language === 'playwright') {
    return `// ${pageName}.js
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

const { chromium } = require('playwright');

class ${className} {
    constructor(page) {
        this.page = page;
        this.url = "${data.pageUrl}";
    }
    
    async visit() {
        await this.page.goto(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

module.exports = ${className};`;
  } else if (language === 'puppeteer') {
    return `// ${pageName}.js
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

class ${className} {
    constructor(page) {
        this.page = page;
        this.url = "${data.pageUrl}";
    }
    
    async visit() {
        await this.page.goto(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

module.exports = ${className};`;
  } else if (language === 'protractor') {
    return `// ${pageName}.js
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

class ${className} {
    constructor() {
        this.url = "${data.pageUrl}";
    }
    
    visit() {
        browser.get(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

module.exports = new ${className}();`;
  } else if (language === 'nightwatch') {
    return `// ${pageName}.js
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

class ${className} {
    constructor() {
        this.url = "${data.pageUrl}";
    }
    
    visit() {
        browser.url(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

module.exports = new ${className}();`;
  } else if (language === 'typescript-webdriverio') {
    return `// ${pageName}.ts
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

export class ${className} {
    private url: string = "${data.pageUrl}";
    
    visit() {
        browser.url(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

export default new ${className}();`;
  } else if (language === 'typescript-playwright') {
    return `// ${pageName}.ts
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

import { Page } from 'playwright';

export class ${className} {
    private page: Page;
    private url: string = "${data.pageUrl}";
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async visit() {
        await this.page.goto(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}`;
  } else if (language === 'typescript-puppeteer') {
    return `// ${pageName}.ts
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

import { Page } from 'puppeteer';

export class ${className} {
    private page: Page;
    private url: string = "${data.pageUrl}";
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async visit() {
        await this.page.goto(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}`;
  } else if (language === 'typescript-protractor') {
    return `// ${pageName}.ts
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

export class ${className} {
    private url: string = "${data.pageUrl}";
    
    visit() {
        browser.get(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

export default new ${className}();`;
  } else if (language === 'typescript-nightwatch') {
    return `// ${pageName}.ts
// Generated POM for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

export class ${className} {
    private url: string = "${data.pageUrl}";
    
    visit() {
        browser.url(this.url);
    }
    
    // Page methods
${methods.join('\n\n')}
}

export default new ${className}();`;
  } else if (language === 'cucumber-java') {
    return `// ${pageName}Steps.java
// Generated Cucumber Step Definitions for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.Select;

public class ${className}Steps {
    
    private WebDriver driver;
    private String url = "${data.pageUrl}";
    
    public ${className}Steps(WebDriver driver) {
        this.driver = driver;
    }
    
    // Step definitions
${methods.join('\n\n')}
}`;
  } else if (language === 'cucumber-javascript') {
    return `// ${pageName}Steps.js
// Generated Cucumber Step Definitions for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

const { Given, When, Then } = require('@cucumber/cucumber');

class ${className}Steps {
    constructor() {
        this.url = "${data.pageUrl}";
    }
    
    // Step definitions
${methods.join('\n\n')}
}

module.exports = ${className}Steps;`;
  } else if (language === 'specflow-csharp') {
    return `// ${pageName}Steps.cs
// Generated SpecFlow Step Definitions for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using TechTalk.SpecFlow;

[Binding]
public class ${className}Steps
{
    private IWebDriver driver;
    private string url = "${data.pageUrl}";
    
    public ${className}Steps(IWebDriver driver)
    {
        this.driver = driver;
    }
    
    // Step definitions
${methods.join('\n\n')}
}`;
  } else if (language === 'robot-framework') {
    return `*** Settings ***
Documentation     Generated Robot Framework Keywords for: ${data.pageTitle}
...               URL: ${data.pageUrl}
...               Total elements found: ${data.totalElements}
...               Interactive elements found: ${data.interactiveElements}
Library           SeleniumLibrary

*** Variables ***
${pageName}URL    ${data.pageUrl}

*** Keywords ***
${methods.join('\n\n')}`;
  } else if (language === 'gauge-java') {
    return `// ${pageName}Steps.java
// Generated Gauge Step Definitions for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

import com.thoughtworks.gauge.Step;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.Select;

public class ${className}Steps {
    
    private WebDriver driver;
    private String url = "${data.pageUrl}";
    
    public ${className}Steps(WebDriver driver) {
        this.driver = driver;
    }
    
    // Step definitions
${methods.join('\n\n')}
}`;
  } else if (language === 'gauge-javascript') {
    return `// ${pageName}Steps.js
// Generated Gauge Step Definitions for: ${data.pageTitle}
// URL: ${data.pageUrl}
// Total elements found: ${data.totalElements}
// Interactive elements found: ${data.interactiveElements}

const { step } = require('gauge-js');

class ${className}Steps {
    constructor() {
        this.url = "${data.pageUrl}";
    }
    
    // Step definitions
${methods.join('\n\n')}
}

module.exports = ${className}Steps;`;
  }
}
  