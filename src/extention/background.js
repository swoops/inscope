function doAllTabs(){
  var gettingAllTabs = browser.tabs.query({});
  gettingAllTabs.then((tabs) => {
    for (let tab of tabs) sendTab(tab);
  });
}

function reloadScope(){
  if (!port) {
    init();
    if (!port) return;
  }
  port.postMessage({verb: "reload"});
}

function messageListener(msg){
  if ( msg["verb"] == "reload" ){
    doAllTabs();
  }else if (msg["verb"] == "check"){
    let icon = { 
      tabId : msg.tabid, 
      path : "icons/black.svg"
    };
    if ( msg.inscope === true ){
      icon.path = "icons/green.svg";
    }else if (msg.inscope === false){
      icon.path = "icons/red.svg";
    }

    let title = {
      tabId : msg.tabid,
      title : msg.ip
    };

    browser.pageAction.setIcon(icon);
    browser.pageAction.setTitle(title);
    browser.pageAction.show(msg.tabid);
  }else {
    let group = "[InScope] Error";
    console.group(group);
    console.log("got unkown msg:");
    console.dir(msg);
    console.groupEnd(group);
  }
}

function sendTab(tab){
  if (!port) return;

  // from a tab get the domain name
  function tabToDomain(tab){
    let url = new URL(tab.url);
    if (! ["https:", "http:"].includes(url.protocol)) 
      return null;
    return url.hostname;
  }

  let msg = {}
  let dom = tabToDomain(tab);
  msg["tabid"] = tab.id;
  msg["domain"] = dom;
  msg["verb"] = "check";
  if ( ! msg["domain"]  ) return;
  /* console.log(`INSCOPE SEND: [${tab.id}] ${dom}`); */
  port.postMessage(msg);
}

function tabListener(id, changeInfo, tab){
  if (tab.status != 'complete') return;
  /* console.log(`update ${tab.url} stuats: ${tab.status}`); */
  sendTab(tab); 
}

function notifyError(err){
  console.error(`[InScope] ERROR: ${err}`);
  if (err.search("No such native application") >= 0){
    console.log(
      "=== InScope ==\n"+
      "Did you install the inscope.py file?\n" +
      "Is the inscope.json path pointing to inscope.py?\n"
    );
  }
}

function init(){
  // connect to app
  if ( port != null ) console.error("Port should be null");
  port = browser.runtime.connectNative("inscope");

  port.onDisconnect.addListener((p) => {
    if (p.error) notifyError(p.error.message);
    if (  browser.tabs.onUpdated.hasListener(tabListener))
      browser.tabs.onUpdated.removeListener(tabListener);
    port = null;
  });

  port.onMessage.addListener(messageListener);
  doAllTabs();
  browser.tabs.onUpdated.addListener(
    tabListener,
    {
      urls: ["https://*/*", "http://*/*"],
      properties: ["status"]
    }
  );
}
var port = null;
browser.pageAction.onClicked.addListener(reloadScope);
init();
