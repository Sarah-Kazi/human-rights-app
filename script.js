function checkRights() {
    // Ask the user questions
    const isViolated = confirm("Do you want to register a complaint?");
  
    if (isViolated) {
      // Show the complaint form
      document.getElementById("complaintForm").style.display = "block";
    } else {
      alert("Yay! Your rights are safe! 🎉");
    }
  }
  
  /*function submitComplaint() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const complaint = document.getElementById("complaint").value;
  
    // Pretend to send to authorities (for now)
    alert(`Complaint sent! 🚀\nName: ${name}\nEmail: ${email}\nComplaint: ${complaint}`);
    
    // Clear the form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("complaint").value = "";
  }*/
  // script.js (frontend)
async function submitComplaint() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const complaint = document.getElementById("complaint").value;
  
    try {
      const response = await fetch('http://localhost:3000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, complaint }),
      });
  
      if (response.ok) {
        alert("Complaint sent to authorities! 🚀");
        // Clear the form
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("complaint").value = "";
      } else {
        alert("Failed to send. Try again later!");
      }
    } catch (error) {
      alert("Oops! Check your internet connection.");
    }
  }

  // Toggle chat visibility
function toggleChat() {
    const chat = document.getElementById('chatContainer');
    chat.style.display = chat.style.display === 'none' ? 'block' : 'none';
  }
  
  // Send user input to backend/Dialogflow
  async function sendToAI() {
    const input = document.getElementById('userInput').value;
    const chatMessages = document.getElementById('chatMessages');
  
    // Add user message
    chatMessages.innerHTML += `<div><strong>You:</strong> ${input}</div>`;
  document.getElementById('userInput').value = ''; // Clear input field
  
    // Call backend
    const response = await fetch('http://localhost:3000/api/check-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
  
    const result = await response.json();
    chatMessages.innerHTML += `<div style="color: #1e90ff;">AI: ${result.message}</div>`;
  
    // Optional: Auto-show complaint form if violation detected
    if (result.violatedRight) {
      document.getElementById('complaintForm').style.display = 'block';
    }
  }
  function startVoiceInput() {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('userInput').value = transcript;
    };
    recognition.start();
  }
  async function sendEmergency() {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Send to backend
        const response = await fetch('http://localhost:3000/api/emergency', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lat: latitude, 
            long: longitude 
          })
        });
  
        if (response.ok) {
          showConfirmation(); // Replace alert with this
        } else {
          alert("Failed to send SOS. Check internet connection!");
        }
      },
      (error) => {
        alert("Error: Please enable location permissions!");
      }
    );
  }
  function showConfirmation() {
    document.getElementById('confirmationScreen').style.display = 'block';
    setTimeout(() => {
      document.getElementById('confirmationScreen').style.display = 'none';
    }, 3000);
  }
// Mock Data
const complaints = [
  { type: "Child Labor", region: "Delhi" },
  { type: "Wage Theft", region: "Mumbai" },
  { type: "Gender Discrimination", region: "Kerala" }
];

// 1. Update Stats (Real-Time Counter)
let activeCount = 0;
let resolvedCount = 0;

setInterval(() => {
  complaints.push({
    type: ["Child Labor", "Wage Theft", "Gender Discrimination"][Math.floor(Math.random() * 3)],
    region: ["Delhi", "Mumbai", "Kerala"][Math.floor(Math.random() * 3)]
  });

  activeCount += Math.floor(Math.random() * 3); // Add 0-2 new complaints
  document.getElementById('activeComplaints').textContent = activeCount;

  // Simulate resolved cases
  resolvedCount += Math.floor(Math.random() * 2); // Add 0-1 resolved cases
  document.getElementById('resolvedCases').textContent = resolvedCount;
}, 2000);

// In script.js (after HTML loads)
document.addEventListener('DOMContentLoaded', () => {
  // Pie Chart (Complaints by Type)
  new Chart(document.getElementById('complaintsByType'), {
    type: 'pie',
    data: {
      labels: ['Child Labor', 'Wage Theft', 'Gender Discrimination'],
      datasets: [{
        data: [35, 45, 20],
        backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d']
      }]
    }
  });

  // Bar Chart (Complaints by Region)
  new Chart(document.getElementById('complaintsByRegion'), {
    type: 'bar',
    data: {
      labels: ['Delhi', 'Mumbai', 'Kerala'],
      datasets: [{
        label: 'Complaints',
        data: [15, 25, 10],
        backgroundColor: '#1e90ff'
      }]
    }
  });
});
