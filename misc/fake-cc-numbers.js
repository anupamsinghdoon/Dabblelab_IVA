/*
  this script generates a list of random fake credit card numbers
*/

const data = [];

for (let step = 0; step < 10; step++) {
    // Runs 5 times, with values of step 0 through 4.
    const number = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
    data.push(number);
  }

let uniqueChars = [...new Set(data)];

var counts = {};
data.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

console.log(counts);

// console.log(uniqueChars);