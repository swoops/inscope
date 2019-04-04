# ![scope icon](./src/extention/icons/scope.svg)inscope
Firefox Extension using Native Messaging to get a websites IP address and check
it against a scope file.

## Why?
Web extensions (addons) are written in JavaScript which can't resolve DNS. Most
extensions get around this by sending HTTP requests contain the site you
visit to some API server. This has the advantage, for them, of tracking you.
Every site you visit results in a request to their server following you along.
For internal sites you are leaking your internal naming convention and will not
receive an answer.

Inscope uses Firefox's [Native Messaging
API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging)
to send the domain names to a python script running locally on your system.
That script just calls `socket.gethostbyname`. The web browser already resolved
the domain name, so the system should still have it in the cache. As a result,
most of the time, not a single additional request is made. No information
(beyond normal DNS) is leaked. I, the developer, am not in a position to track
you, steal internal naming schemes, and sell the information to ad networks.
The code base is open and rather small.

The only downside of Native Messaging is a more complicated installation. It is
not that bad though. 

Additionally, create a `/tmp/ff_scope` file containing a new line separate list
of IP addresses. When the python script resolves an IP, it will check if that
IP is in the provided list. If so it will make the inscope icon turn green
(![scope icon](./src/extention/icons/green.svg)). Otherwise it will be red
(![scope icon](./src/extention/icons/green.svg)). If you update the
`/tmp/ff_scope` file, then click the inscope icon to tell it to re parse the
file.


## Usability
This is still very new. If you have trouble let me know. Pull requests are
welcome.

## Installation
1. install the xpi file in Firefox.
2. Move `src/app/inscope.py` somewhere good and make sure it is executable.
3. Move `src/app/inscope.json` to the appropriate [location](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#Manifest_location)
4. Replace the `path` variable in the manifest file (`src/app/inscope.json`)
with the full path to `src/app/inscope.py`

I wrote the `install.sh` to do the Native application install, on Linux, the
way I like it. This may not be the way you like it though.
