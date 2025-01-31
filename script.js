// webcam javascript code
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const resultText = document.getElementById('result');
const nutritionDiv = document.getElementById('nutrition');

// Access Webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => console.error("Webcam access denied", error));

// Capture image and process
document.getElementById('capture').addEventListener('click', async () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to Base64
    const imageData = canvas.toDataURL('image/jpeg').split(',')[1]; // Get Base64 data

    // Convert Base64 to Blob
    const blob = convertBase64ToBlob(imageData, 'image/jpeg');

    // Save the Blob as a JPG file
    saveBlobAsFile(blob, 'WIN_20250131_11_54_58_Pro.jpg');
    console.log('Image saved as WIN_20250131_11_54_58_Pro.jpg');

    // Use the API to recognize the food item
    const response = await recognizeFood(imageData);
    console.log(response);
});

// Function to convert Base64 to Blob
function convertBase64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i<slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

// Function to save Blob as a file
function saveBlobAsFile(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

// Function to recognize food using the API 
async function recognizeFood(imageData) {
    const apiUrl = 'http://127.0.0.1:5000/recognize';
    const requestBody = {
        image_url: `data:image/jpeg;base64,${imageData}`
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.food_item;
    } catch (error) {
        console.error('Error recognizing food:', error);
    }
}
