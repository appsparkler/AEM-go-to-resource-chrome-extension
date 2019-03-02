const GLOBALS = {
    contextMenuItemId: 'AEM-DEV-SUPER-TOOLS-go-to-published-page'
};

setup_contentMenuItem();
chrome.contextMenus.onClicked.addListener(handle_contextMenuClicked);

// private functions
function setup_contentMenuItem() {
    const contextMenuItem = {
        id: GLOBALS.contextMenuItemId,
        title: 'Go To CRX Resource',
        contexts: ["selection"]
    };
    chrome.contextMenus.create(contextMenuItem);
}

function handle_contextMenuClicked(ctxData) {
    if(ctxData.menuItemId === GLOBALS.contextMenuItemId)
        open_tabForPublishedPage(ctxData);
}

async function open_tabForPublishedPage(ctxData) {
    const activeTab = await get_activeTab();
    open_tab(ctxData, activeTab);
}

function open_tab(ctxData, activeTab) {
    const { selectionText } = ctxData;
    const { url } = activeTab;
    const locationObject = document.createElement('a');
    locationObject.href = url;
    const origin = locationObject.origin;
    const tabItemConfig = {
        url: `${origin}/crx/de/index.jsp#${selectionText}`,
        pinned: true
    }
    chrome.tabs.create(tabItemConfig);
}

function get_activeTab() {
    return new Promise(function(resolve, reject) {
        const tabQuery = {
            currentWindow: true,
            active: true
        };
        chrome.tabs.query(tabQuery, function(tabs) {
            resolve(tabs[0]);
        })
    });
}
