// === Page Object Generator - Background Service Worker ===
// Handles requests from popup or browser connection
console.log('Background script loaded');

chrome.runtime.onMessage.addListener((msg: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  console.log('Background: Message received:', msg);
  console.log('Background: Sender:', sender);
  
  if (msg.type === 'SCAN_PAGE') {
    console.log('Background: Getting active tab...');
    
    // Get the active tab since the message is coming from the popup
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.log('Background: No active tab found');
        sendResponse({ error: 'No active tab found' });
        return;
      }
      
      const activeTab = tabs[0];
      console.log('Background: Active tab found:', activeTab);
      
      if (!activeTab.id) {
        console.log('Background: No tab ID found');
        sendResponse({ error: 'No tab ID found' });
        return;
      }
      
      const tabId = activeTab.id;
      
      try {
        // First try to send message to existing content script
        console.log('Background: Trying to send message to existing content script...');
        chrome.tabs.sendMessage(tabId, { type: 'SCAN_DOM' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Background: No existing content script, injecting new one...');
            // If no content script exists, inject one
            chrome.scripting.executeScript(
              {
                target: { tabId: tabId },
                files: ['content-script.js']
              },
              () => {
                console.log('Background: Content script injected, now sending message...');
                // Wait a moment for the script to load, then send message
                setTimeout(() => {
                  chrome.tabs.sendMessage(tabId, { type: 'SCAN_DOM' }, (response) => {
                    console.log('Background: Content script response received:', response);
                    
                    if (chrome.runtime.lastError) {
                      console.error('Background: Chrome runtime error:', chrome.runtime.lastError);
                      sendResponse({ error: chrome.runtime.lastError.message });
                    } else {
                      console.log('Background: Sending response to popup:', response);
                      sendResponse(response);
                    }
                  });
                }, 100);
              }
            );
          } else {
            console.log('Background: Content script response received:', response);
            sendResponse(response);
          }
        });
      } catch (error: any) {
        console.error('Background: Error sending message to content script:', error);
        sendResponse({ error: error.message });
      }
    });
    
    return true; // async
  } else {
    console.log('Background: Invalid message type');
    console.log('Background: Message type:', msg.type);
    sendResponse(null);
  }
});
