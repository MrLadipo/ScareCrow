document.addEventListener("DOMContentLoaded", function () {
  async function fetchData() {
    // Fetching the data...
    try {
      let data;
      // Try fetching data from the API
      try {
        // "https://fachtr347yjiu3gdisemx4opdy0zsaxo.lambda-url.us-east-1.on.aws/"
        const response = await fetch(Data);
        data = await response.json();
      } catch (apiError) {
        console.error("Error fetching data from API:", apiError);
      }

      // Check if data has the expected properties
      if (
        (data && data.datetime && data.farmid) ||
        data.rat ||
        data.rabbit ||
        data.sparrow ||
        data.squirrel ||
        data.pigeon ||
        data.crow
      ) {
        console.log("API data:", data);

        // Display each property in its corresponding div for the ff
        // datetime
        document.getElementById("datetime").textContent = `${data.datetime(
          DD,
          MM,
          YY
        )}`;
        // farm id
        document.getElementById("farmid").textContent = `${data.farmid}`;
        // rat
        document.getElementById("rat").textContent = `${data.rat}`;
        // rabbit
        document.getElementById("rabbit").textContent = `${data.rabbit}`;
        // sparrow
        document.getElementById("sparrow").textContent = `${data.sparrow}`;
        // squirrel
        document.getElementById("squirrel").textContent = `${data.sqiurrel}`;
        // pigeon
        document.getElementById("pigeon").textContent = `${data.pigeon}`;
        // crow
        document.getElementById("crow").textContent = `${data.crow}`;

        // Display conditions texts in the corresponding divs
        // rat condition
        const ratPresence = checkRatPresence(data);
        document.getElementById("ratPresence").textContent = `${ratPresence}`;
        colorCodeElement("ratPresence", ratPresence);

        // rabbit condition
        const rabbitPresence = checkRabbitPresence(data);
        document.getElementById(
          "rabbitPresence"
        ).textContent = `${rabbitPresence}`;
        colorCodeElement("rabbitPresence", rabbitPresence);

        // squirrel condition
        const squirrelPresence = checkSquirrelPresence(data);
        document.getElementById(
          "squirrelPresence"
        ).textContent = `${squirrelPresence}`;
        colorCodeElement("squirrelPresence", squirrelPresence);

        // sparrow condition
        const sparrowPresence = checkSparrowPresence(data);
        document.getElementById(
          "sparrowPresence"
        ).textContent = `${sparrowPresence}`;
        colorCodeElement("sparrowPresence", sparrowPresence);

        // pigeon condition
        const pigeonPresence = checkPigeonPresence(data);
        document.getElementById(
          "pigeonPresence"
        ).textContent = `${pigeonPresence}`;
        colorCodeElement("pigeonPresence", pigeonPresence);

        // crow condition
        const crowPresence = checkCrowPresence(data);
        document.getElementById("crowPresence").textContent = `${crowPresence}`;
        colorCodeElement("crowPresence", crowPresence);

        // overall action taken
        const OverallAction = checkOverallAction(
          ratPresence,
          rabbitPresence,
          squirrelPresence,
          sparrowPresence,
          pigeonPresence,
          crowPresence
        );
        document.getElementById(
          "overallAction"
        ).textContent = `${OverallAction}`;
        colorCodeElement("overallAction", OverallAction);

        // overall pests seen
        const overallPresence = checkOverallPresence(
          ratPresence,
          rabbitPresence,
          squirrelPresence,
          sparrowPresence,
          pigeonPresence,
          crowPresence
        );
        document.getElementById(
          "overallPresence"
        ).textContent = `${overallPresence}`;
        colorCodeElement("overallPresence", overallPresence);
      } else {
        console.error("Error fetching data: Missing properties in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Sample DATA
    const data = {
      datetime: "2024-01-23",
      rat: "rat",
      sparrow: "sparrow",
      sqiurrel: "sqiurrel",
      farmid: "Beau-01",
    };

  // Function rat seen
  function checkRatPresence(data) {
    // Determine rat presence based on the provided data
    // You can customize this based on your requirements

    if (data.rat === "rat") {
      return "Detected";
    } else {
      return "None";
    }
  }

  // Function rabbit seen
  function checkRabbitPresence(data) {
    // Determine rat presence based on the provided data
    // You can customize this based on your requirements

    if (data.rabbit === "rabbit") {
      return "Detected";
    } else {
      return "None";
    }
  }

  // Function squirrel seen
  function checkSquirrelPresence(data) {
    // Determine rat presence based on the provided data
    // You can customize this based on your requirements

    if (data.squirrel === "squirrel") {
      return "Detected";
    } else {
      return "None";
    }
  }

  // Function sparrow seen
  function checkSparrowPresence(data) {
    // Determine rat presence based on the provided data
    // You can customize this based on your requirements

    if (data.sparrow === "sparrow") {
      return "Detected";
    } else {
      return "None";
    }
  }

  // Function pigeon seen
  function checkPigeonPresence(data) {
    // Determine rat presence based on the provided data
    // You can customize this based on your requirements

    if (data.pigeon === "pigeon") {
      return "Detected";
    } else {
      return "None";
    }
  }

  // Function crow seen
  function checkCrowPresence(data) {
    // Determine rat presence based on the provided data
    // You can customize this based on your requirements

    if (data.crow === "crow") {
      return "Detected";
    } else {
      return "None";
    }
  }

  // Function for overall Responses
  function checkOverallPresence(
    ratPresence,
    rabbitPresence,
    squirrelPresence,
    sparrowPresence,
    pigeonPresence,
    crowPresence
  ) {
    // Combine responses for all entities based on your logic
    // For simplicity, I'm using a basic logic here, you may customize it based on your requirements

    const rat = ratPresence;
    const rabbit = rabbitPresence;
    const squirrel = squirrelPresence;
    const sparrow = sparrowPresence;
    const pigeon = pigeonPresence;
    const crow = crowPresence;

    if (
      rat === "Detected" ||
      rabbit === "Detected" ||
      squirrel === "Detected" ||
      sparrow === "Detected" ||
      pigeon === "Detected" ||
      crow === "Detected"
    ) {
      return "PESTS SEEN!";
    } else {
      return "NO ACTIVITY";
    }
  }

  // Function for overall condition
  function checkOverallAction(
    ratPresence,
    rabbitPresence,
    squirrelPresence,
    sparrowPresence,
    pigeonPresence,
    crowPresence
  ) {
    // Combine conditions for all entities based on your logic
    // For simplicity, I'm using a basic logic here, you may customize it based on your requirements

    const rat = ratPresence;
    const rabbit = rabbitPresence;
    const squirrel = squirrelPresence;
    const sparrow = sparrowPresence;
    const pigeon = pigeonPresence;
    const crow = crowPresence;

    if (
      rat === "Detected" ||
      rabbit === "Detected" ||
      squirrel === "Detected" ||
      sparrow === "Detected" ||
      pigeon === "Detected" ||
      crow === "Detected"
    ) {
      return "Activate LIGHT and SOUND";
    } else {
      return "YOU'R GOOD!!!";
    }
  }

  function colorCodeElement(elementId, text) {
    const element = document.getElementById(elementId);

    if (text.includes("Detected" || "Activate" || "SEEN")) {
      element.style.color = "red";
    } else if (text.includes("GOOD" || "None" || "ACTIVITY")) {
      element.style.color = "green";
    } else {
      element.style.color = "orange";
    }
  }
  // Call the fetchData function when your page loads or on a user action
  fetchData();

  // Set up periodic polling (every 2 minutes)
  setInterval(fetchData, 120000);
});
