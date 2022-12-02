const installOrPlayApp_event = "installOrPlayApp";
const changeBannerBackgroundImage_event = "changeBannerBackgroundImage";
const getInstalledApps_event = "getInstalledApps";
const openBrowser_event = "openBrowser";

const updateInstalledAppsNotification_callbackEvent =
  "updateInstalledAppsNotification";

const callbackEventMapping = {};

window.onload = (event) => {
  if (qt != undefined) {
    new QWebChannel(qt.webChannelTransport, function (channel) {
      window.webBridge = channel.objects.webBridge;
      window.webBridge.contentChanged.connect((response) => {
        const { event, data } = response;
        webBridge_onCallback(event, data);
      });
    });
  }
};

function webBridge_postApiRequest(
  event,
  data = {},
  callbackEvent = null,
  ga = {},
  page = 0x0000
) {
  const requestData = JSON.stringify({ event, data, page, callbackEvent, ga });
  console.log(`webBridge request :${requestData}`);
  window.webBridge?.dataChanged(requestData);
}

function webBridge_onCallback(event, data) {  
  if (callbackEventMapping.hasOwnProperty(event)) {
    callback_func = callbackEventMapping[event];
    callback_func(data);
  }
}

function webBridge_openBrowser(url_to_lauch) {
  data = {
    url: url_to_lauch,
    type: 2,
  };
  webBridge_postApiRequest(openBrowser_event, data);
}

function webBridge_installOrPlayApp(package_name) {
  data = package_name;
  webBridge_postApiRequest(installOrPlayApp_event, data);
}

function webBridge_changeBannerBackgroundImage(
  image_url,
  video_url,
  video_playCount,
  time_delay_before_next_loop_in_seconds
) {
  data = {
    url: image_url,
    video: video_url,
    playCount: video_playCount,
    sleep: time_delay_before_next_loop_in_seconds * 1000,
  };
  webBridge_postApiRequest(changeBannerBackgroundImage_event, data);
}

function webBridge_getInstalledApps(callback_func) {
  callbackEventMapping[updateInstalledAppsNotification_callbackEvent] =
    callback_func;
  webBridge_postApiRequest(
    getInstalledApps_event,
    {},
    updateInstalledAppsNotification_callbackEvent
  );
}
