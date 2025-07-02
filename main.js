// --- Navigation between sections ---
function navigate(sectionId) {
  document
    .querySelectorAll("section")
    .forEach((sec) => (sec.style.display = "none"));
  document.getElementById(sectionId).style.display = "block";
}

// --- Diet Generator ---
function generateDiet(age) {
  if (!age || age < 1) {
    return "Please enter a valid age.";
  }
  if (age < 18) {
    return "High-protein balanced diet for growth.";
  } else if (age <= 40) {
    return "Balanced diet with cardio exercise.";
  } else {
    return "Low-sodium heart-friendly diet.";
  }
}

// --- On Page Load ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Fact Card Expand/Collapse ---
  document.querySelectorAll(".fact-card").forEach((card) => {
    card.addEventListener("click", () => {
      const detail = card.querySelector(".fact-detail");
      const isVisible = detail.style.display === "block";
      document
        .querySelectorAll(".fact-detail")
        .forEach((p) => (p.style.display = "none"));
      detail.style.display = isVisible ? "none" : "block";
    });
  });

  // --- Heart Disease Prediction Form ---
  const form = document.getElementById("prediction-form");
  const dietSection = document.getElementById("diet");
  const dietResult = document.getElementById("diet-result");

  if (dietSection) dietSection.style.display = "none";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const userData = {
        age: document.getElementById("age").value,
        chol: document.getElementById("chol").value,
        trestbps: document.getElementById("trestbps").value,
      };

      if (dietSection) dietSection.style.display = "none";
      if (dietResult) dietResult.innerText = "";

      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not OK");
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
            showPredictionMessage("Prediction failed: " + data.error, "error");
            return;
          }

          const predictionResult = data.result.toLowerCase();

          if (["heart disease", "positive", "yes"].includes(predictionResult)) {
            if (dietSection) dietSection.style.display = "block";
            const age = parseInt(userData.age);
            if (dietResult) {
              dietResult.innerText = "Recommended Diet: " + generateDiet(age);
            }
          } else {
            if (dietSection) dietSection.style.display = "none";
          }

          showPredictionMessage(
            `Prediction Result: ${data.result}`,
            predictionResult
          );
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          alert("An error occurred. Please try again.");
          showPredictionMessage("Error: " + error.message, "error");
          if (dietSection) dietSection.style.display = "none";
        });
    });
  } else {
    console.error("Form with id 'prediction-form' not found.");
  }
});

// --- Show Prediction Message ---
function showPredictionMessage(message, prediction) {
  let resultDiv = document.getElementById("prediction-result");
  const form = document.getElementById("prediction-form");

  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.id = "prediction-result";
    resultDiv.style.marginTop = "10px";
    resultDiv.style.fontWeight = "bold";
    form.parentNode.insertBefore(resultDiv, form.nextSibling);
  }

  resultDiv.innerText = message;

  if (["heart disease", "positive", "yes"].includes(prediction)) {
    resultDiv.style.color = "#FF7F7F"; // Soft Coral for heart disease
  } else if (prediction === "error") {
    resultDiv.style.color = "#FFB347"; // Soft Amber for errors
  } else {
    resultDiv.style.color = "#3CB4AC"; // Teal/Aqua for no disease
  }
}

// --- Toggle Fact and Card States ---
function toggleFact(element) {
  element.classList.toggle("active");
}
function toggleCard(card) {
  card.classList.toggle("active");
}

// --- Optional: Separate Fact Descriptions ---
const facts = {
  fact1: {
    short: "Exercise improves heart health.",
    full: "Regular exercise strengthens the heart muscle, lowers blood pressure, and helps manage weight.",
  },
  fact2: {
    short: "Smoking damages your arteries.",
    full: "Smoking causes inflammation and narrowing of blood vessels, increasing heart disease risk.",
  },
};

function showFact(factKey) {
  const description = document.getElementById("fact-description");
  const fullDesc = document.getElementById("full-description");

  description.innerText = facts[factKey].short;
  fullDesc.innerText = "";

  description.onclick = () => {
    fullDesc.innerText = facts[factKey].full;
  };
}

// --- Navigation Link Handlers ---
document.getElementById("home-link").addEventListener("click", () => {
  location.reload();
});
document.getElementById("explore-link").addEventListener("click", () => {
  document
    .getElementById("did-you-know")
    .scrollIntoView({ behavior: "smooth" });
});
document.getElementById("about-link").addEventListener("click", () => {
  document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
});

// --- Utility Scroll Helpers ---
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const query = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  if (!query) return;
  // Get all searchable elements (customize this as needed)
  const searchableElements = document.querySelectorAll(
    "h1, h2, h3, p, .fact-card, .section-title"
  );
  let found = false;
  searchableElements.forEach((el) => {
    const text = el.innerText.toLowerCase();
    // Remove previous highlights
    el.classList.remove("highlight");

    if (text.includes(query) && !found) {
      el.classList.add("highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      found = true;
    }
  });
});

function resetSearch() {
  document.getElementById("search-input").value = "";
  document
    .querySelectorAll(".highlight")
    .forEach((el) => el.classList.remove("highlight"));
}

function toggleResetButton() {
  const resetBtn = document.querySelector(".reset-btn");
  const input = document.getElementById("search-input").value.trim();
  resetBtn.style.display = input ? "inline" : "none";
}
// --- Debounce Utility Function ---
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// --- Debounced Real-Time Search ---
function handleSearch() {
  const query = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();
  const searchableElements = document.querySelectorAll(
    "h1, h2, h3, p, .fact-card, .section-title"
  );

  let found = false;

  searchableElements.forEach((el) => {
    const text = el.innerText.toLowerCase();
    el.classList.remove("highlight");

    if (text.includes(query) && !found && query.length > 0) {
      el.classList.add("highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      found = true;
    }
  });
  if (!found && query.length > 0) {
    showNotification("No match found for: " + query);
  }
}
function showNotification(message) {
  let existing = document.getElementById("search-notification");
  if (existing) existing.remove();

  const notif = document.createElement("div");
  notif.id = "search-notification";
  notif.innerText = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 3000);
}

// --- Attach Debounced Search on Input ---
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300));
  }
});
