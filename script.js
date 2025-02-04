// Preview uploaded image
function previewImage(event) {
    const fileInput = document.getElementById('imageUpload');
    const preview = document.getElementById('preview');
    const resultDiv = document.getElementById('result');
    const classifyButton = document.getElementById('classifyButton');
    const uploadText = document.getElementById('uploadText'); 
  
    if (fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function () {
        preview.src = reader.result;
        preview.style.display = 'block';
        resultDiv.textContent = ""; // Clear previous result
        classifyButton.disabled = false; // Enable classify button
        uploadText.style.display = 'none';
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      preview.style.display = 'none';
      classifyButton.disabled = true;
    }
  }
  
  // Send image to backend and get prediction
  function submitImage() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    const classifyButton = document.getElementById('classifyButton');
    const loadingText = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
  
    if (!file) {
      alert("Please select an image.");
      return;
    }
  
    // Disable button and show loading
    classifyButton.disabled = true;
    loadingText.style.display = 'block';
    resultDiv.textContent = "";
  
    const formData = new FormData();
    formData.append("file", file);
  
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.prediction !== undefined) {
        resultDiv.textContent = `Predicted snake: ${data.prediction}`;
      } else {
        resultDiv.textContent = `Error: ${data.error || "Unknown error"}`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.textContent = 'An error occurred while processing the image!';
    })
    .finally(() => {
      classifyButton.disabled = false;
      loadingText.style.display = 'none';
    });
  }

  