chrome.runtime.onMessage.addListener(createBoxes);

// Create an array filled with objects consisting of the name and grade of each assignment that is submitted and graded, and send it to the popup
function createBoxes() {
  let allitems = []
  let body = document.getElementsByTagName("tbody")[0];
  let rows = body.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].getElementsByTagName("td")[0].className === "submissionStatus" || rows[i].getElementsByTagName("td")[0].className === "submissionStatus sorting_1") {
      let assignment = {
        name: rows[i].getElementsByTagName("th")[0].textContent, 
        score: rows[i].getElementsByTagName("td")[0].getElementsByClassName("submissionStatus--score")[0].textContent}
      allitems.push(assignment)
    }
  }
  chrome.runtime.sendMessage(allitems);}


