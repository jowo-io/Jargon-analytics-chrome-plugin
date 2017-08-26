## Readme

To install, navigate to chrome://extensions/
and check the "developer mode" box on the top right
then click Load unpacked extention and choose this folder

or

drag and drop the .crx file into the chrome://extensions/ tab

## Uploading word description pairs
The file you upload into the plugin should be a .json file containing a json object that has key value pairs. for example:

{
	"word1": "description goes here",
	"word2": "description goes here"
}

Any other values or a broken syntactic structure will lead to unknown effects - most likely breaking the functionality of the plugin.

within the description you can place linebreaks with \n and you can place and URLs and they'll be turned to hyperlinks in the plugin.

When the app is first installed, and before a .json file has been uploaded, a default keyword list is used. This list can be found, and editted, in source/contentscript.js