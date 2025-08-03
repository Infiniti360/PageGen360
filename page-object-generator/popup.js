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
  }
}
  