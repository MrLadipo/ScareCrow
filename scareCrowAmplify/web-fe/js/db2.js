const ANIMAL_TYPES = ["rat", "rabbit", "squirrel", "sparrow", "pigeon", "crow"];

async function fetchData() {
  try {
    const response = await fetch(
      "https://ft7ic874h6.execute-api.us-east-1.amazonaws.com/prod/signal"
    );
    const responseData = await response.json();

    if (
      Array.isArray(responseData.Inference) &&
      responseData.Inference.length > 0
    ) {
      const data = responseData.Inference[0];

      if (validateData(data)) {
        displayData(data);
      } else {
        console.error("Error fetching data: Missing properties in response");
      }
    } else {
      console.error("Error fetching data: Empty or invalid response format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function validateData(data) {
  return (
    data &&
    data.datetime &&
    data.farmID &&
    data.prediction &&
    data.Identified_pest &&
    data.farm_name &&
    data.signal
  );
}

function displayData(data) {
  const dateTime = new Date(data.datetime);
  const date = dateTime.toISOString().split("T")[0]; // Extract date
  const time = dateTime.toTimeString().split(" ")[0]; // Extract time

  document.getElementById("date").textContent = date;
  document.getElementById("time").textContent = time;
  document.getElementById("farmname").textContent = data.farm_name;
  document.getElementById("signal").textContent = data.signal + ` Activated`;
  document.getElementById("farmid").textContent = data.farmID;

  let overallPresence = "None";

  ANIMAL_TYPES.forEach((animal) => {
    let presence = "None";
    if (data.Identified_pest === animal) {
      presence = "Detected";
      overallPresence = "PESTS SEEN!";
    }

    displayCondition(`${animal}Presence`, presence);
  });

  document.getElementById("overallPresence").textContent = overallPresence;
}

function displayCondition(id, condition) {
  const element = document.getElementById(id);
  element.textContent = condition;
  colorCodeElement(element, condition);
}

function colorCodeElement(element, text) {
  if (text.includes("Detected")) {
    element.style.color = "red";
  } else if (text.includes("None")) {
    element.style.color = "green";
  } else {
    element.style.color = "orange";
  }
}

fetchData();
setInterval(fetchData, 15000);
