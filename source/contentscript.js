//define the name of the storage variable.
var storageNamespace = "lolkeg_data";

//checks browser storage for previously saved data
//and if it doesnt exist we define a default.
if (!localStorage[storageNamespace]) {
  localStorage[storageNamespace] = JSON.stringify({
    lorem: "hats hats hats far away.",
    ipsum:
      "pah babababababa babbababa. \n\n\n http://soapbox.github.io/linkifyjs/docs/"
  });
}

/*
*
*
*
* The plan:
* split dictionary keys into an array of words.
* sort dictionary by key array length
* check for a match of the first word of the key's word array.
* if match found on first word, check rest.
*
*
*
*/

//gets the data from browser storage and converts it from a string to a javascript object
var data = JSON.parse(localStorage[storageNamespace]);

//this code loops through the entire DOM, looking for html elements/ text elements
//and within those it looks for words matching the uploaded data set
//and then once it's found matching words they are all added to the: pairs array
//and once the whole DOM has been search the DOM is updated again based the pairs array
//The function is anonymous, so the code is self contained. It's executed onces when the window loads
(function() {
  var elements = document.getElementsByTagName("*");
  var pairs = [];
  var timeout = 0;
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j];
      if (node.nodeType === 3) {
        var text = node.nodeValue;
        console.log(text);
        var textArray = text.split(" ");
        var replacedArray = [];
        var changed = false;

        for (var k = 0; k < textArray.length; k++) {
          replacedArray.push(textArray[k]);
          for (var key in data) {
            var str = textArray[k].toLowerCase().replace(/^[a-z ]$/i, "");
            if (
              (str.indexOf(key) === 0 || str === key + "s") &&
              str.length <= key.length + 1
            ) {
              replacedArray[k] =
                "<span class='lolkeg' keyword='" +
                key +
                "'>" +
                textArray[k] +
                "</span>";
              changed = true;
              break;
            }
          }
        }
        var replacedText = replacedArray.join(" ");

        if (changed === true) {
          pairs.push({
            element: element,
            old: node,
            new: "<span>" + replacedText + "</span>"
          });
        }
      }
    }
  }
  console.log(pairs[0]);
  for (var j = 0; j < pairs.length; j++) {
    pairs[j].element.replaceChild($(pairs[j].new)[0], pairs[j].old);
  }
})();

//listens for new data received when a new file is uploaded in options.js
//and when it receives the data saves it to the browser storage so it can
//be accessed next time the browser window is refreshed / loaded
if (
  chrome &&
  chrome.runtime &&
  chrome.runtime.onMessage &&
  chrome.runtime.onMessage.addListener
) {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    localStorage[storageNamespace] = request.data;
  });
}

//look into the DOM for the body element and any .lolkeg classes (which are added to words for highlighting)
var body = $("body", document);
var words = $(".lolkeg");

//create a new DOM element with a class called masterkey
//for holding the the word descriptions
let holder = $("<div class='masterkeg'></div>");
body.append(holder);

// this function positions the holders to be next to the mouse,
//and also if the mouse is in the left hand of the screen,
//the older will be to the right of the mouse, and vice versa
words.mouseover(function(event) {
  clearTimeout(timeout);
  var left = event.pageX;
  var top = event.pageY;
  if ($(window).width() / 2 < event.pageX) {
    left -= 300;
  }

  //get the keyword from the html word element and use it to
  //to get the description of the same word from the data var
  var key = $(event.target).attr("keyword");
  var text = "";
  text += titleCase(key); //add the keyword to the top in uppercase
  text += "<br>"; //add linebreak
  text += data[key].replace(/\n/g, "<br>"); //add the description with any \n turned into html linebreaks
  holder.html(text); //set the text to be inside the holder element

  //add position and display to block, which makes the holder visible again
  holder.css({
    display: "block",
    top: top + "px",
    left: left + "px"
  });

  //turn any URLs in the holder into a Hyperlink (uses the likify plugin in the /lib/ folder)
  holder.linkify({
    target: "_blank"
  });
});

//when the mouse goes over the holder, make sure the timeout is removed
holder.mouseover(function(event) {
  clearTimeout(timeout);
});

//when the mouse leaves either the holder or a word, start the timeout to hide the holder
words.mouseout(startTimeout);
holder.mouseout(startTimeout);

//define a timeout variable and a function that creates a timeout
//which when triggered will hide the holder / .masterkeg element
var timeout;
function startTimeout() {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    holder.css({
      display: "none"
    });
  }, 1000);
}

//this function makes the first letter of each word in a string turn to upper case
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}
