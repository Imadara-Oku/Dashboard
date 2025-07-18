// Elements
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const termsCheckbox = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const errorBox = document.getElementById('errorBox');
const matchError = document.getElementById('matchError');
const passwordChecklist = document.getElementById('passwordChecklist');
const usernameFeedback = document.getElementById('usernameFeedback');
const emailFeedback = document.getElementById('emailFeedback');
const passwordStrengthText = document.getElementById('passwordStrengthText');
const passwordStrengthFill = document.getElementById('passwordStrengthFill');
const formContainer = document.querySelector('.form-container');

// Flags
let usernameTouched = false;
let emailTouched = false;
let passwordTouched = false;
let isReduced = false;

// Password rules
const rules = {
    length: { test: (pwd) => pwd.length >= 8 && pwd.length <= 20, element: "rule-length" },
    uppercase: { test: (pwd) => /[A-Z]/.test(pwd), element: "rule-uppercase" },
    lowercase: { test: (pwd) => /[a-z]/.test(pwd), element: "rule-lowercase" },
    number: { test: (pwd) => /\d/.test(pwd), element: "rule-number" },
    special: { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), element: "rule-special" },
    space: { test: (pwd) => !/\s/.test(pwd), element: "rule-space" },
    repeat: { test: (pwd) => !/(.)\1\1\1/.test(pwd), element: "rule-repeat" }
};

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

function isStrictPassword(pwd) {
    if (pwd.length === 0) return false;
    return Object.values(rules).every(rule => rule.test(pwd));
}

function passwordsMatch(pwd, confirmPwd) {
    return pwd === confirmPwd && pwd.length > 0;
}

function updateInputFeedback(input, isValid) {
    if (input.value.trim() === '') {
        input.style.borderColor = "#ccc";
        input.style.boxShadow = "none";
        input.removeAttribute('data-valid');
    } else {
        input.style.borderColor = isValid ? "#4CAF50" : "#F44336";
        input.style.boxShadow = isValid ? "0 0 5px #4CAF50" : "0 0 5px #F44336";
        if (isValid) {
            input.setAttribute('data-valid', 'true');
        } else {
            input.removeAttribute('data-valid');
        }
    }
}

function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    const btn = input.nextElementSibling;
    if (input.type === "password") {
        input.type = "text";
        btn.textContent = "Hide";
    } else {
        input.type = "password";
        btn.textContent = "Show";
    }
}

function updateFormSize() {
    const usernameVal = usernameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;

    const usernameFilled = usernameVal.length > 0;
    const emailFilled = emailVal.length > 0;
    const passwordFilled = passwordVal.length > 0;

    const usernameValid = usernameTouched && usernameFilled && isValidUsername(usernameVal);
    const emailValid = emailTouched && emailFilled && isValidEmail(emailVal);
    const passwordValid = passwordTouched && passwordFilled && isStrictPassword(passwordVal);

    const isAnyInvalidAndTouched =
        (usernameTouched && usernameFilled && !usernameValid) ||
        (emailTouched && emailFilled && !emailValid) ||
        (passwordTouched && passwordFilled && !passwordValid) ||
        (passwordChecklist.style.display === "block" && passwordTouched && passwordFilled) ||
        (confirmPasswordInput.value.length > 0 && !passwordsMatch(passwordVal, confirmPasswordInput.value));

    if (isAnyInvalidAndTouched && !isReduced) {
        formContainer.classList.add('reduced');
    } else if (!isReduced) {
        formContainer.classList.remove('reduced');
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
}

function updatePasswordStrengthMeter(password) {
    const score = calculatePasswordStrength(password);
    let strengthText = '';
    let color = '';
    let widthPercent = (score / 6) * 100;

    switch (score) {
        case 0:
        case 1:
            strengthText = 'Very Weak';
            color = 'red';
            break;
        case 2:
            strengthText = 'Weak';
            color = 'orange';
            break;
        case 3:
            strengthText = 'Fair';
            color = 'goldenrod';
            break;
        case 4:
            strengthText = 'Good';
            color = 'blue';
            break;
        case 5:
        case 6:
            strengthText = 'Strong';
            color = 'green';
            break;
    }

    passwordStrengthText.textContent = password.length > 0 ? `Password Strength: ${strengthText}` : '';
    passwordStrengthText.style.color = color;
    passwordStrengthFill.style.width = password.length > 0 ? widthPercent + '%' : '0%';
    passwordStrengthFill.style.backgroundColor = color;
}

function toggleReduce() {
    isReduced = !isReduced;
    formContainer.classList.toggle('reduced', isReduced);
    if (isReduced) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function validateForm() {
    errorBox.textContent = "";
    let formIsValid = true;

    if (usernameTouched) {
        const val = usernameInput.value.trim();
        if (!isValidUsername(val)) {
            usernameFeedback.textContent = "Username: 4-20 chars, letters, numbers, special (!@#$%^&*()_+-=), max 2 underscores, no consecutive underscores, no spaces.";
            usernameFeedback.style.color = "#F44336";
            updateInputFeedback(usernameInput, false);
            formIsValid = false;
        } else {
            usernameFeedback.textContent = "";
            updateInputFeedback(usernameInput, true);
        }
    } else {
        usernameFeedback.textContent = "";
        updateInputFeedback(usernameInput, false);
    }

    if (emailTouched) {
        const val = emailInput.value.trim();
        if (!isValidEmail(val)) {
            emailFeedback.textContent = "Enter a valid email address (e.g., example@domain.com), no consecutive underscores in username part.";
            emailFeedback.style.color = "#F44336";
            updateInputFeedback(emailInput, false);
            formIsValid = false;
        } else {
            emailFeedback.textContent = "";
            updateInputFeedback(emailInput, true);
        }
    } else {
        emailFeedback.textContent = "";
        updateInputFeedback(emailInput, false);
    }

    const pwd = passwordInput.value;
    let allRulesPass = true;

    if (passwordTouched) {
        if (pwd.length > 0) {
            passwordChecklist.style.display = "block";
            Object.values(rules).forEach(rule => {
                const li = document.getElementById(rule.element);
                const passed = rule.test(pwd);
                li.textContent = (passed ? "✅ " : "☐ ") + li.textContent.slice(2);
                li.classList.toggle('valid', passed);
                li.classList.toggle('invalid', !passed);
                li.style.color = passed ? "green" : "red";
                if (!passed) allRulesPass = false;
            });
        } else {
            allRulesPass = false;
            passwordChecklist.style.display = "none";
            Object.values(rules).forEach(rule => {
                const li = document.getElementById(rule.element);
                li.textContent = "☐ " + li.textContent.slice(2);
                li.classList.remove('valid', 'invalid');
                li.style.color = 'grey';
            });
        }

        if (allRulesPass && pwd.length > 0) {
            passwordChecklist.style.display = "none";
            passwordInput.setAttribute('data-valid', 'true');
        } else {
            passwordInput.removeAttribute('data-valid');
            formIsValid = false;
        }
        updateInputFeedback(passwordInput, allRulesPass && pwd.length > 0);
    } else {
        passwordChecklist.style.display = "none";
        updateInputFeedback(passwordInput, false);
    }

    const confirmPwd = confirmPasswordInput.value;
    const match = passwordsMatch(pwd, confirmPwd);

    if (confirmPwd.length > 0 && !match) {
        matchError.style.display = "block";
        updateInputFeedback(confirmPasswordInput, false);
        formIsValid = false;
    } else {
        matchError.style.display = "none";
        updateInputFeedback(confirmPasswordInput, match && confirmPwd.length > 0);
        if (!match && confirmPwd.length > 0) formIsValid = false;
    }

    if (confirmPwd.length === 0) {
        updateInputFeedback(confirmPasswordInput, false);
    }

    if (!termsCheckbox.checked) {
        formIsValid = false;
    }

    submitBtn.disabled = !formIsValid;
    updateFormSize();

    return formIsValid;
}

// Event listeners
[usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('click', toggleReduce);
});
usernameInput.addEventListener('focus', () => { usernameTouched = true; validateForm(); });
emailInput.addEventListener('focus', () => { emailTouched = true; validateForm(); });
passwordInput.addEventListener('focus', () => { passwordTouched = true; validateForm(); });
passwordInput.addEventListener('input', () => updatePasswordStrengthMeter(passwordInput.value));

[usernameInput, emailInput, passwordInput, confirmPasswordInput, termsCheckbox].forEach(el => {
    el.addEventListener('input', validateForm);
    if (el.type === 'checkbox') el.addEventListener('change', validateForm);
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    usernameTouched = true;
    emailTouched = true;
    passwordTouched = true;

    if (validateForm()) {
        alert("Registration successful! Redirecting to Dashboard...");
        this.reset();
        usernameTouched = false;
        emailTouched = false;
        passwordTouched = false;
        isReduced = false;
        formContainer.classList.remove('reduced');
        submitBtn.disabled = true;
        errorBox.textContent = "";
        [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            updateInputFeedback(input, false);
        });
        usernameFeedback.textContent = "";
        emailFeedback.textContent = "";
        matchError.style.display = "none";
        passwordChecklist.style.display = "none";
        Object.values(rules).forEach(rule => {
            const li = document.getElementById(rule.element);
            li.textContent = "☐ " + li.textContent.slice(2);
            li.classList.remove('valid', 'invalid');
            li.style.color = 'grey';
        });
        window.location.href = "index.html";
    } else {
        errorBox.textContent = "Please fix the errors above before signing up.";
    }
});

window.togglePassword = togglePassword;
validateForm();
