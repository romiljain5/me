// Text to be typed
const textToType = "This is a typing animation.";

// Element where the text will be displayed
const outputElement = document.getElementById("output");

// Function to simulate typing animation
function typeText(text, element) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 50); // Adjust typing speed (milliseconds per character)
        }
    }

    type();
}

// Call the typing animation function
typeText(textToType, outputElement);
