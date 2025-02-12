const snakeLinks = {
  "Ahaetulla nasuta": {
      "image": "https://www.inaturalist.org/taxa/68528-Ahaetulla-nasuta",
      "video": "https://www.inaturalist.org/taxa/68528-Ahaetulla-nasuta"
  },
  "Bungarus multicinctus": {
      "image": "https://www.inaturalist.org/taxa/30442-Bungarus-multicinctus",
      "video": "https://www.inaturalist.org/taxa/30442-Bungarus-multicinctus"
  },
  "Naja naja": {
      "image": "https://www.inaturalist.org/taxa/53492-Naja-naja",
      "video": "https://www.inaturalist.org/taxa/53492-Naja-naja"
  },
  "Python molurus": {
      "image": "https://www.inaturalist.org/taxa/32150-Python-molurus",
      "video": "https://www.inaturalist.org/taxa/32150-Python-molurus"
  }
};

document.getElementById("loading").style.display = "none";

// Preview uploaded image
function previewImage(event) {
  const fileInput = document.getElementById("imageUpload");
  const preview = document.getElementById("preview");
  const resultDiv = document.getElementById("result");
  const classifyButton = document.getElementById("classifyButton");
  const uploadText = document.getElementById("uploadText");

  if (fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function () {
          preview.src = reader.result;
          preview.style.display = "block";
          resultDiv.innerHTML = ""; // Clear previous results
          classifyButton.disabled = false; // Enable classify button
          uploadText.style.display = "none";
      };
      reader.readAsDataURL(fileInput.files[0]);
  } else {
      preview.style.display = "none";
      classifyButton.disabled = true;
  }
}

// Preview uploaded video
function previewVideo(event) {
  const fileInput = document.getElementById("videoUpload");
  const preview = document.getElementById("videoPreview");
  const classifyButton = document.getElementById("classifyVideoButton");

  if (fileInput.files.length > 0) {
      preview.src = URL.createObjectURL(fileInput.files[0]);
      preview.style.display = "block";
      classifyButton.disabled = false;
  } else {
      preview.style.display = "none";
      classifyButton.disabled = true;
  }
}

// Send image to backend and get prediction
function submitImage() {
  const fileInput = document.getElementById("imageUpload");
  const file = fileInput.files[0];
  const classifyButton = document.getElementById("classifyButton");
  const loadingText = document.getElementById("loading");
  const resultDiv = document.getElementById("result");
  const finalClassDiv = document.getElementById("finalClass");
  const avgConfidenceDiv = document.getElementById("avgConfidence");

  if (!file) {
      alert("Please select an image.");
      return;
  }

  // Disable button and show loading
  classifyButton.disabled = true;
  loadingText.style.display = "block";
  resultDiv.innerHTML = "";

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.prediction !== undefined) {
          const snakeName = data.prediction;
          const snakeLink = snakeLinks[snakeName]?.image || "#"; // Default to '#' if no link is found

          finalClassDiv.innerHTML = `<a href="${snakeLink}" target="_blank">${snakeName}</a>`;
          avgConfidenceDiv.innerHTML = `${(data.confidence * 100).toFixed(2)}%`;
      } else {
          resultDiv.textContent = `Error: ${data.error || "Unknown error"}`;
      }
  })
  .catch(error => {
      console.error("Error:", error);
      resultDiv.textContent = "An error occurred while processing the image!";
  })
  .finally(() => {
      classifyButton.disabled = false;
      loadingText.style.display = "none";
  });
}

// Send video to backend for classification
function submitVideo() {
  const fileInput = document.getElementById("videoUpload");
  const file = fileInput.files[0];
  const classifyButton = document.getElementById("classifyVideoButton");
  const loadingText = document.getElementById("loading");
  const resultDiv = document.getElementById("result");
  const finalClassDiv = document.getElementById("finalClass");
  const avgConfidenceDiv = document.getElementById("avgConfidence");

  if (!file) {
      alert("Please select a video.");
      return;
  }

  // Disable button and show loading
  classifyButton.disabled = true;
  loadingText.style.display = "block";
  resultDiv.innerHTML = "";
  finalClassDiv.innerHTML = "";
  avgConfidenceDiv.innerHTML = "";

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:5000/predict_video", {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      loadingText.style.display = "none";

      if (data.prediction && data.confidence !== undefined) {
          const snakeName = data.prediction;
          const snakeLink = snakeLinks[snakeName]?.video || "#"; // Default to '#' if no link is found
          
          finalClassDiv.innerHTML = `<strong>Final Prediction:</strong> <a href="${snakeLink}" target="_blank">${snakeName}</a>`;
          avgConfidenceDiv.innerHTML = `<strong>Average Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%`;
      } else {
          resultDiv.textContent = `Error: ${data.error || "Unknown error"}`;
      }
  })
  .catch(error => {
      console.error("Error:", error);
      resultDiv.textContent = "An error occurred while processing the video!";
  })
  .finally(() => {
      classifyButton.disabled = false;
      loadingText.style.display = "none";
  });
}