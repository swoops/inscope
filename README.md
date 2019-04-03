# inscope
Firefox Extension using Native Messaging to get a websites IP address and check
it against a scope file.

## Usability
This is still beta. I don't recommend using it unless you know what you are
doing.

## Installation
1. install the xpi file in Firefox.
2. Move `src/app/inscope.py` somewhere good and make sure it is executable.
3. Move `src/app/inscope.json` to the appropriate [location](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#Manifest_location)
4. Replace the `path` variable in the manifest file (`src/app/inscope.json`)
with the full path to `src/app/inscope.py`

I wrote the `install.sh` to do the Native application install, on Linux, the
way I like it. This may not be the way you like it though.
