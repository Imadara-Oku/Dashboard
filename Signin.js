// ✅ Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById("password");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

// Validation functions
function isValidUsername(username) {
    if (username.length < 4 || username.length > 20) return false;
    const allowedCharsPattern = /^[a-zA-Z0-9_!@#$%^&*()\-\+=]+$/;
    if (!allowedCharsPattern.test(username)) return false;
    if (/\s/.test(username)) return false;
    if (/__/.test(username)) return false;
    const underscoreCount = (username.match(/_/g) || []).length;
    if (underscoreCount > 2) return false;
    return true;
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return false;
    const localPart = email.split('@')[0];
    if (/__/.test(localPart)) return false;
    return true;
}

const rules = {
    length: { test: (pwd) => pwd.length >= 8 && pwd.length <= 20, element: "rule-length" },
    uppercase: { test: (pwd) => /[A-Z]/.test(pwd), element: "rule-uppercase" },
    lowercase: { test: (pwd) => /[a-z]/.test(pwd), element: "rule-lowercase" },
    number: { test: (pwd) => /\d/.test(pwd), element: "rule-number" },
    special: { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), element: "rule-special" },
    space: { test: (pwd) => !/\s/.test(pwd), element: "rule-space" },
    repeat: { test: (pwd) => !/(.)\1\1\1/.test(pwd), element: "rule-repeat" }
};

function isStrictPassword(pwd) {
    if (pwd.length === 0) return false;
    return Object.values(rules).every(rule => rule.test(pwd));
}

function checkPasswordOnFocus() {
    const passwordInput = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("errorBox");
    if (!isStrictPassword(passwordInput) && passwordInput.length > 0) {
    errorBox.textContent = "Sorry, your password was incorrect. Please double-check your password.";
    errorBox.style.display = "block";
    document.getElementById("password").style.borderColor = "#F44336";
    document.getElementById("password").style.boxShadow = "0 0 5px #F44336";
    }
}

function validateInput() {
    const userInput = document.getElementById("userInput").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("errorBox");
    let isValid = true;

    // Validate username/email/phone
    if (!userInput) {
    errorBox.textContent = "Please enter a correct username, valid email, or phone.";
    errorBox.style.display = "block";
    document.getElementById("userInput").style.borderColor = "#F44336";
    document.getElementById("userInput").style.boxShadow = "0 0 5px #F44336";
    isValid = false;
    } else if (userInput.includes('@')) {
    if (!isValidEmail(userInput)) {
        errorBox.textContent = "Please enter a correct username, valid email, or phone.";
        errorBox.style.display = "block";
        document.getElementById("userInput").style.borderColor = "#F44336";
        document.getElementById("userInput").style.boxShadow = "0 0 5px #F44336";
        isValid = false;
    } else {
        errorBox.textContent = ""; // Clear prompt immediately on valid email
        errorBox.style.display = "none";
        document.getElementById("userInput").style.borderColor = "#4CAF50";
        document.getElementById("userInput").style.boxShadow = "0 0 5px #4CAF50";
        setTimeout(() => {
        document.getElementById("userInput").style.borderColor = "#000";
        document.getElementById("userInput").style.boxShadow = "none";
        }, 500);
    }
    } else if (!isValidUsername(userInput)) {
    errorBox.textContent = "Please enter a correct username, valid email, or phone.";
    errorBox.style.display = "block";
    document.getElementById("userInput").style.borderColor = "#F44336";
    document.getElementById("userInput").style.boxShadow = "0 0 5px #F44336";
    isValid = false;
    } else {
    errorBox.textContent = ""; // Clear prompt immediately on valid username
    errorBox.style.display = "none";
    document.getElementById("userInput").style.borderColor = "#4CAF50";
    document.getElementById("userInput").style.boxShadow = "0 0 5px #4CAF50";
    setTimeout(() => {
        document.getElementById("userInput").style.borderColor = "#000";
        document.getElementById("userInput").style.boxShadow = "none";
    }, 500);
    }

    // Validate password
    if (!isValid && !passwordInput) {
    // Do nothing if userInput is invalid
    } else if (!isStrictPassword(passwordInput) && passwordInput.length > 0) {
    errorBox.textContent = "Sorry, your password was incorrect. Please double-check your password.";
    errorBox.style.display = "block";
    document.getElementById("password").style.borderColor = "#F44336";
    document.getElementById("password").style.boxShadow = "0 0 5px #F44336";
    isValid = false;
    } else if (isStrictPassword(passwordInput)) {
    errorBox.textContent = ""; // Clear prompt immediately on valid password
    errorBox.style.display = "none";
    document.getElementById("password").style.borderColor = "#4CAF50";
    document.getElementById("password").style.boxShadow = "0 0 5px #4CAF50";
    setTimeout(() => {
        document.getElementById("password").style.borderColor = "#000";
        document.getElementById("password").style.boxShadow = "none";
    }, 500);
    }

    console.log("Validation result:", isValid); // Debug validation
    return isValid;
}

// ✅ Main login handler
function handleLogin(event) {
    event.preventDefault();
    if (validateInput()) {
    alert("Login successful! Redirecting to Dashboard...");
    document.getElementById("login-form").reset();
    errorBox.style.display = "none";
    [document.getElementById("userInput"), document.getElementById("password")].forEach(input => {
        input.style.borderColor = "#000";
        input.style.boxShadow = "none";
    });
    console.log("Attempting redirect to dashboard.html");
    try {
        window.location.href = "./index.html"; // Attempt redirect
        console.log("Redirect executed");
    } catch (e) {
        console.error("Redirect failed:", e);
        errorBox.textContent = "Unable to redirect to dashboard. Check if dashboard.html exists.";
        errorBox.style.display = "block";
    }
    } else {
    errorBox.style.display = "block";
    }
}
