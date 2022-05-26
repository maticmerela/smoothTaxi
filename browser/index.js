var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
};

var tabelcaSpelca = [];

var badRightTurnDaily = 0;
var goodRightTurnDaily = 0;
var goodLeftTurnOverall = 0;
var badLeftTurnOverall = 0;
var smoothBrakingOverall = 0;
var strongBreakingOverall = 0;

function updateFieldIfNotNull(fieldName, value, precision = 10) {
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

function klasificiraj(tabelcaSpelca) {
  var classifier2 = new EdgeImpulseClassifier();
  classifier2.init();
  let res = classifier2.classify(tabelcaSpelca);

  document.querySelector("#results").textContent = JSON.stringify(res, null, 4);

  var max = 0;
  var max_label;
  for (var i = 0; i < res.results.length; i++) {
    if (max == 0 || res.results[i].value > max) {
      max = res.results[i].value;
      max_label = res.results[i].label;
    }
  }

  document.getElementById("test1").innerHTML = max;
  document.getElementById("test2").innerHTML = max_label;



// {
//     label: "mocno zaviranje 🚨",
//     value: 0.01953125
// },
// {
//     label: "sibko zaviranje ✅",
//     value: 0.14453125
// },
// {
//     label: "voznja",
//     value: 0.65234375
// }

  if(max_label == "desno grdo zavijanje"){
    badRightTurnDaily++;
    document.getElementById("badRightTurnDaily").innerHTML(badRightTurnDaily);
  } else if(max_label == "desno lepo zavijanje"){
    goodRightTurnDaily++;
    document.getElementById("goodRightTurnDaily").innerHTML(goodRightTurnDaily);
  } else if(max_label == "levo grdo zavijanje"){
    badLeftTurnOverall++;
    document.getElementById("badLeftTurnOverall").innerHTML(badLeftTurnOverall);
  } else if(max_label == "levo lepo zavijanje"){
    goodLeftTurnOverall++;
    document.getElementById("goodLeftTurnOverall").innerHTML(goodLeftTurnOverall);
  } else if(max_label == "mocno zaviranje 🚨"){
    strongBreakingOverall++;
    document.getElementById("strongBreakingOverall").innerHTML(strongBreakingOverall);
  } else if(max_label == "sibko zaviranje ✅"){
    smoothBrakingOverall++;
    document.getElementById("smoothBrakingOverall").innerHTML(smoothBrakingOverall);
  }

}

function handleMotion(event) {
  tabelcaSpelca.push(event.accelerationIncludingGravity.x);
  tabelcaSpelca.push(event.accelerationIncludingGravity.y);
  tabelcaSpelca.push(event.accelerationIncludingGravity.z);

  document.getElementById("test3").innerHTML =
    "dolzina tabelce " + tabelcaSpelca.length;

  if (tabelcaSpelca.length > 540) {
    klasificiraj(tabelcaSpelca);
    tabelcaSpelca = [];
  }
}

// START OF CYCLE
let is_running = false;
let demo_button = document.getElementById("start_demo");
demo_button.onclick = function (e) {
  e.preventDefault();

  // Request permission for iOS 13+ devices
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  var len = 0;

  if (is_running) {
    window.removeEventListener("devicemotion", handleMotion);
    demo_button.innerHTML = "Start demo";
    demo_button.classList.add("btn-success");
    demo_button.classList.remove("btn-danger");
    is_running = false;
  } else {
    window.addEventListener("devicemotion", handleMotion);
    document.getElementById("start_demo").innerHTML = "koncaj merjenje";
    demo_button.classList.remove("btn-success");
    demo_button.classList.add("btn-danger");
    is_running = true;
  }
};
