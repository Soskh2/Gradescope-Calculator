document.addEventListener("DOMContentLoaded", function() {
  needBoxes()
});

// When popup opens request checkboxes from content
function needBoxes() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
	let msg = {
		txt : "need boxes"
	}
	chrome.tabs.sendMessage(activeTab.id,msg);
  });
}

// Calls below function when receives a message from contents
chrome.runtime.onMessage.addListener(gotPopMessage);

// Takes the checkboxes from content and displays them
function gotPopMessage(request, sender, sendResponse) {

  // If no graded assignments yet
  if (request.length === 0) {
    document.getElementsByClassName("page")[0].innerHTML = '<h1>' + 'There are no graded assignments yet!' + '</h1>' + '<p class ="error" >' + 'Check back after you have submitted an assignment and your professor has graded it!' + '</p>'
  }
  else {
    allitems = request
    createBoxes(allitems)
  }
};


// Creates checkboxes on page when given boxes (from request)
function createBoxes(boxes) {
  boxstr = '<ul style="list-style-type:none;" id= \'checked\' class= \'checked\'>' 
  for (el in boxes) {
    boxstr += '<li>' + "<input type=\'checkbox\' class= \'checkbox\' checked>" + boxes[el].name + '</li>'
  };
  boxstr += '</ul>';
  pagestr = "<h1 id= 'average'>" + "Click the Button to See Your Average" + "</h1>" +
  "<div class='boxes'>" + boxstr + "</div>" +
  "<div class='options'>" +
    "<input type='radio' name='choose' id='selectall'>" +
    "<label for='selectall'>Select All</label>" +
    "<input type='radio' name='choose' id='deselectall'>" +
    "<label for='deselectall'>Deselect All</label>" +
    "</div>" +
    "<div class='calc-btn'>" +
      "<button id='Calculate'>Calculate</button>" +
    "</div>"
  document.getElementsByClassName("page")[0].innerHTML = pagestr

  document.getElementById("Calculate").addEventListener("click", calcClicked);
  document.getElementById("selectall").addEventListener("change", selectAll);
  document.getElementById("deselectall").addEventListener("change", deSelectAll);

}

// Send message to content when calculate button is clicked
function calcClicked() {

  // Gets the boxes that are checked
  let checkedarr = []
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
	checked = document.getElementById("checked").getElementsByTagName("li");
  for (i = 0; i < checked.length; i++) {
    if (checked[i].getElementsByTagName("input")[0].checked) {
      checkedarr.push(checked[i].textContent)
    }
  }

  // Calculates the average of the assignments
  let topSum = bottomSum = 0
  for (el in checkedarr) {
    score = getScore(checkedarr[el], allitems);
    topSum += parseFloat(score.substr(0, score.indexOf('/')));
    bottomSum += parseFloat(score.substr((score.indexOf('/') + 2), (score.length - 1)));
  }
  average = topSum / bottomSum

  // Displays the average
  percentage = (average * 100).toFixed(2)
  if (percentage === "NaN") {
    average = '<p class= "NaN">' + "Please choose at least one assignment" + '</p>'
  }
  else {
    average = '<p class="score">' + percentage + ' %' + '</p>'
  }

  document.getElementsByClassName("page")[0].innerHTML = '<p2>' + "Your Average Is" + '</p2>' + 
                                                           average

  });
}

// Finds the score of each assignment
function getScore(name, items) {
  for (el in items) {
    if (items[el].name === name) {
      return(items[el].score)
    }
  }
} 

// When select all button is clicked, checks each box
function selectAll() {
  let boxes = document.getElementsByClassName("boxes")[0].getElementsByTagName("input")
  if (document.getElementById("selectall").checked) {
    for (el in boxes) {
      boxes[el].checked=true;
    }
  }
}

// When deselect all button is clicked, unchecks each box
function deSelectAll() {
  let boxes = document.getElementsByClassName("boxes")[0].getElementsByTagName("input")
  if (document.getElementById("deselectall").checked) {
    for (el in boxes) {
      boxes[el].checked=false;
  }
}
}

