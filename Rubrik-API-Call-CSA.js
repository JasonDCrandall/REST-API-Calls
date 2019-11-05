/*
  This program Makes an API call to Rubrik to pull vm information and store it in a 
  CSA dropdown menu.

  Author: Jason Crandall
*/


// Define the username and password for the api authentication
const user = "admin";
const pass = "";
const url = "";

// Define the id of the desired vm and variable needed
const vmID = 'VirtualMachine:::b131bd4f-775c-4d88-92a5-e8f72ab8e1b1-vm-18023';
const variable = '"name":';

// Creat new XMLHttopRequest
var XMLHttpRequests = require("xmlhttprequest").XMLHttpRequest;
var xhttp = new XMLHttpRequests();

// Open the request and override the SSL certificate
xhttp.open("GET", url, true, user, pass);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// If the call passes, import the response text, pull the required data, and add it to the drop down menu
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var response = xhttp.responseText;

    // Search the response for the desired data
    let reg = new RegExp('\\' + variable + '(["])(?:(?=(\\\\?))\\2.)*?\\1', 'gm');
    let responseList = response.match(reg);

    // Clear the unnecessary text off of the data values
    let cleanList = [];
    for (let i = 0; i < responseList.length; i++) {
      let item = responseList[i].slice(variable.length);
      item = item.slice(1, -1);
      cleanList.push(item);
    }

    // Store the clean values in a new data array
    let finalArray = removeDuplicates(cleanList);
    let dataArray = [];
    dataArray.push(finalArray);

    console.log(dataArray);

    // Initialize the CSA List Array (populated with 'displayName' & 'value')
    var availableValues = [];

    // Add the display names and values the user will see
    dataArray[0].forEach(function (dnsZone) {
      availableValues.push({
        'displayName': dnsZone,
        'value': dnsZone
      });
    });
  }
};

xhttp.send();

/*
 * This function removes the duplicate values found in an array and 
 * returns the new unique array with no duplicates. It does this by
 * creating a new array and slowly adding values to that array unless
 * there is already an index for that value.
 * 
 * Parameters: array  -- the array that needs to remove duplicates
 * 
 * Returns: unique array -- the new array with duplicates removed
*/
function removeDuplicates(array) {
  let uniqueArray = [];
  for (let i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) == -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
}

