const inputElement = document.getElementById("command-input");
const outputElement = document.getElementById("output");
const userPromptElement = document.getElementById("user-prompt");
const terminalElement = document.getElementById("terminal");

let commandHistory = [];
let historyIndex = -1;

terminalElement.addEventListener("click", () => {
  inputElement.focus();
});

inputElement.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const command = inputElement.value;
    await executeCommand(command);
    inputElement.value = "";

    // Add the command to history
    commandHistory.unshift(command);
    historyIndex = -1;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();

    // Show previous command from history
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputElement.value = commandHistory[historyIndex];
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();

    // Show next command from history
    if (historyIndex >= 0) {
      historyIndex--;
      if (historyIndex === -1) {
        inputElement.value = "";
      } else {
        inputElement.value = commandHistory[historyIndex];
      }
    }
  }
});

inputElement.addEventListener("input", updateTypedCommand);

function typeText(text, element) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 0.05); // Adjust typing speed (milliseconds per character)
        }
    }

    type();
}

async function executeCommand(command) {
  // Add the command to the output
  outputElement.innerHTML += `<div><span class="prompt">$ romil-jain-dev >> </span> ${command}</div>`;

  if (command === "get-location") {
    // Show loading message
    outputElement.innerHTML += `<div>Loading...</div>`;
  }

  // Execute the command and get the response
  const response = await simulateCommandExecution(command);

  if (command === "get-location") {
    // Remove the loading message
    const loadingMessage = outputElement.querySelector("div:last-child");
    if (loadingMessage && loadingMessage.textContent === "Loading...") {
      loadingMessage.remove();
    }
  }
  // Display the response (if any)
  if (response) {
    outputElement.innerHTML += `<div>${response}</div>`;
    // typeText(response, outputElement);

  }
  // Scroll to the bottom of the terminal
  terminalElement.scrollTop = terminalElement.scrollHeight;
}

function updateTypedCommand() {
  const typedCommand = inputElement.value;
  userPromptElement.textContent = `$ romil-jain-dev >> ${typedCommand}`;
}

function clearTerminal() {
  // Remove all child elements from the output element
  while (outputElement.firstChild) {
    outputElement.removeChild(outputElement.firstChild);
  }
}

function getUserLocation() {
  if ("geolocation" in navigator) {
    // Geolocation is available
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Get the latitude and longitude from the position object
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // You can now use the latitude and longitude or perform other actions with the location data
        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        // You can also display this information to the user
        alert(
          "Your location: Latitude " + latitude + ", Longitude " + longitude
        );
      },
      function (error) {
        // Handle any errors that occur when trying to get the user's location
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
        }
      }
    );
  } else {
    // Geolocation is not available in this browser
    console.error("Geolocation is not available in your browser.");
  }
}

async function getUserLocationAsync() {
  return new Promise(async (resolve, reject) => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((innerResolve, innerReject) => {
          navigator.geolocation.getCurrentPosition(innerResolve, innerReject);
        });

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        resolve({ latitude, longitude });
      } catch (error) {
        reject("Error getting user location: " + error.message);
      }
    } else {
      reject("Geolocation is not available in your browser.");
    }
  });
}

async function getLocation(){
    try {
        const location = await getUserLocationAsync();
        console.log("Latitude: " + location.latitude);
        console.log("Longitude: " + location.longitude);
        return (
          "Your location: Latitude " +
          location.latitude +
          ", Longitude " +
          location.longitude
        );
      } catch (error) {
        return error;
      };
}

async function simulateCommandExecution(command) {
  switch (command.toLowerCase()) {
    case "help":
      return `<div>
<span style="color: #01d293;">Available Commands:</span><br>
<span style="color: #01d293;">whoami:</span> <span style="color: #ccc;">Who are you?</span>
<span style="color: #01d293;">whois:</span> <span style="color: #ccc;">Who is Romil Jain?</span>
<span style="color: #01d293;">email:</span> <span style="color: #ccc;">Do not mail me</span>
<span style="color: #01d293;">history:</span> <span style="color: #ccc;">View command history</span>
<span style="color: #01d293;">secret:</span> <span style="color: #ccc;">Find the password</span>
<span style="color: #01d293;">get-location:</span> <span style="color: #ccc;">Gets your current location</span>
<span style="color: #01d293;">social:</span> <span style="color: #ccc;">Display social networks</span>
<span style="color: #01d293;">banner:</span> <span style="color: #ccc;">Shows banner</span>
<span style="color: #01d293;">clear:</span> <span style="color: #ccc;">Clear terminal</span>
</div>
`;
    case "whoami":
        const userAgent=window.navigator.userAgent;
        const userLanguage=window.navigator.language;
        const timezoneOffsetMinutes = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const getGeo = await getLocation();
        return `
<span style="color: #01d293;">User Agent:</span> ${userAgent}, 
<span style="color: #01d293;">User Language:</span> ${userLanguage},
<span style="color: #01d293;">User Timezone:</span> ${timezoneOffsetMinutes},
<span style="color: #01d293;">User Location:</span> ${getGeo}
        `;
    //   return "You are the user behind the screen, the commander of this terminal, and the one who holds the power to explore and control this digital world.";
    case "":
      return;
    case "clear":
      clearTerminal();
      outputElement.removeChild(outputElement.firstChild);
      return;
    case "history":
      const allCommands = commandHistory
        .map((ele) => {
          return `<div>${ele}</div>`;
        })
        .join("");
      return `<div>${allCommands}</div>`;
    case "banner":
      const imageElement = document.createElement("img");
      const name = `<pre>
██████   ██████  ███    ███ ██ ██               ██  █████  ██ ███    ██ 
██   ██ ██    ██ ████  ████ ██ ██               ██ ██   ██ ██ ████   ██ 
██████  ██    ██ ██ ████ ██ ██ ██               ██ ███████ ██ ██ ██  ██ 
██   ██ ██    ██ ██  ██  ██ ██ ██          ██   ██ ██   ██ ██ ██  ██ ██ 
██   ██  ██████  ██      ██ ██ ███████      █████  ██   ██ ██ ██   ████ .dev
</pre>`;

      // Create a container div to hold the image and the name
      const container = document.createElement("div");

      // Create a div for the image
      const imageContainer = document.createElement("div");
      imageContainer.style.marginRight = "20px";
      imageContainer.appendChild(imageElement);
      imageElement.src =
        "https://cdn-icons-png.flaticon.com/512/4661/4661320.png";
      imageElement.style.width = "100px";

      // Create a div for the name
      const nameContainer = document.createElement("div");
      nameContainer.innerHTML = name;

      // Apply CSS styles to make them appear side by side
      container.style.display = "flex"; // Use flexbox for layout
      container.style.alignItems = "center"; // Vertically center the content

      // Append both containers to the main container
      container.appendChild(imageContainer);
      container.appendChild(nameContainer);

      // Append the main container to the outputElement
      outputElement.appendChild(container);
      return;
    case "social":
      return `<table style="border: none; border-collapse: collapse; width: auto; background: transparent;">
    <tr>
        <td style="line-height: 5px;">
            youtube
        </td>
        <td style="line-height: 5px;">
            <a href="https://www.youtube.com/channel/UCXiZiJ6KAhPLSUrN5ILXXiw" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;" 
            To change the background color of the link when it's hovered over, you can modify the style attribute in the onmouseover and onmouseout attributes. Here's an example of how to do it:
            
            html
            Copy code
            <td style="line-height: 5px;">
                <a href="https://www.youtube.com/channel/UCXiZiJ6KAhPLSUrN5ILXXiw" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;"
                onmouseover="this.querySelector('span').style.color='black'; this.querySelector('span').style.backgroundColor='#01d293'; this.querySelector('span').style.padding='2px 10px'; this.querySelector('span').style.borderRadius='20px';"
                onmouseout="this.querySelector('span').style.color='skyblue'; this.querySelector('span').style.backgroundColor='transparent';">
                 <span>youtube/romil jain</span>
            </a>
        </td>
    </tr>
    <tr>
        <td style="line-height: 5px;">
            instagram
        </td>
        <td style="line-height: 5px;">
            <a href="https://www.instagram.com/romil_jain99/" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;"
            onmouseover="this.querySelector('span').style.color='black'; this.querySelector('span').style.backgroundColor='#01d293'; this.querySelector('span').style.padding='2px 10px'; this.querySelector('span').style.borderRadius='20px';"
                onmouseout="this.querySelector('span').style.color='skyblue'; this.querySelector('span').style.backgroundColor='transparent';">
                <span>instagram/romil_jain99</span>
            </a>
        </td>
    </tr>
    <tr>
        <td style="line-height: 5px;">
            linkedin
        </td>
        <td style="line-height: 5px;">
            <a href="https://www.linkedin.com/in/romil-jain123/" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;"
            onmouseover="this.querySelector('span').style.color='black'; this.querySelector('span').style.backgroundColor='#01d293'; this.querySelector('span').style.padding='2px 10px'; this.querySelector('span').style.borderRadius='20px';"
                onmouseout="this.querySelector('span').style.color='skyblue'; this.querySelector('span').style.backgroundColor='transparent';">
                 
                <span>linkedin/romil-jain123</span>
            </a>
        </td>
    </tr>
    <tr>
        <td style="line-height: 5px;">
            twitter
        </td>
        <td style="line-height: 5px;">
            <a href="https://twitter.com/romiljai" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;"
            onmouseover="this.querySelector('span').style.color='black'; this.querySelector('span').style.backgroundColor='#01d293'; this.querySelector('span').style.padding='2px 10px'; this.querySelector('span').style.borderRadius='20px';"
                onmouseout="this.querySelector('span').style.color='skyblue'; this.querySelector('span').style.backgroundColor='transparent';">
                <span>twitter/romiljai</span>
            </a>
        </td>
    </tr>
    <tr>
        <td style="line-height: 5px;">
            github
        </td>
        <td style="line-height: 5px;">
            <a href="https://github.com/romiljain5" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;"
            onmouseover="this.querySelector('span').style.color='black'; this.querySelector('span').style.backgroundColor='#01d293'; this.querySelector('span').style.padding='2px 10px'; this.querySelector('span').style.borderRadius='20px';"
                onmouseout="this.querySelector('span').style.color='skyblue'; this.querySelector('span').style.backgroundColor='transparent';">
                <span>github/romiljain5</span>
            </a>
        </td>
    </tr>
    <tr>
        <td style="line-height: 5px;" style="line-height: 5px;">
            behance
        </td>
        <td style="line-height: 5px;">
            <a href="https://www.behance.net/romiljain2" target="_blank" style="text-decoration: none; color: skyblue; cursor: pointer;"
            onmouseover="this.querySelector('span').style.color='black'; this.querySelector('span').style.backgroundColor='#01d293'; this.querySelector('span').style.padding='2px 10px'; this.querySelector('span').style.borderRadius='20px';"
                onmouseout="this.querySelector('span').style.color='skyblue'; this.querySelector('span').style.backgroundColor='transparent';">
                <span>behance/romiljain2</span>
            </a>
        </td>
    </tr>
</table>`;
    case "secret":
      const userInput = prompt('Please enter a secret:');

      // Check if the user entered something or clicked "Cancel"
      if(userInput === `passwordfornerd`){
        // User entered something, you can treat userInput as a secret here
        outputElement.innerHTML += `<div style="color: #01d293">HURRAY! You guessed correct</div>`;
      }else if (userInput !== null) {
        // User entered something, you can treat userInput as a secret here
        outputElement.innerHTML += `<div>${userInput} is not the correct password</div>`;
      } else {
        // User clicked "Cancel" or closed the prompt
        outputElement.innerHTML += `<div>User canceled or closed the prompt.</div>`;
      }
      break;
    case "whois":
        return typeText(`Just a developer like you`, outputElement);
    case "get-location":
      return await getLocation();
    case "email":
        const mailtoLink = `mailto:${'jromil51@gmail.com'}`;
        window.open(mailtoLink, "_blank");
        return 'Redirecting to email page';
    default:
      return typeText(`Command not found: ${command}`, outputElement);
  }
}
