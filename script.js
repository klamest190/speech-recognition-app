 // Check for browser support
 window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

 if ('SpeechRecognition' in window) {
     // Speech Recognition supported
     const recognition = new SpeechRecognition();
     const textField = document.getElementById('textField');
     const startBtn = document.getElementById('startBtn');
     const stopBtn = document.getElementById('stopBtn');
     const deleteBtn = document.getElementById('deleteBtn');
     const listeningIndicator = document.getElementById('listeningIndicator');

     recognition.continuous = true; // Keep recognizing even if the user pauses
     recognition.interimResults = false; // Do not return interim results

     let isNewSession = false; // Flag to check if it's a new recording session

     // Function to process transcript
     function processTranscript(transcript) {
         transcript = transcript.trim();

         // Capitalize the first letter
         if (transcript.length > 0) {
             transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
         }

         // Add a period at the end if it doesn't already end with punctuation
         if (transcript.length > 0 && !/[.!?]$/.test(transcript)) {
             transcript += '.';
         }

         return transcript;
     }

     // Function to save text to localStorage
     function saveText() {
         localStorage.setItem('transcribedText', textField.value);
     }

     // Load text from localStorage on page load
     window.addEventListener('load', () => {
         const storedText = localStorage.getItem('transcribedText');
         if (storedText) {
             textField.value = storedText;
         }
     });

     recognition.onstart = () => {
         // Show the listening indicator
         listeningIndicator.style.visibility = 'visible';
         listeningIndicator.classList.add('listening-animation');

         // Change the start button appearance
         startBtn.classList.add('listening-animation');
     };

     recognition.onend = () => {
         // Hide the listening indicator
         listeningIndicator.style.visibility = 'hidden';
         listeningIndicator.classList.remove('listening-animation');

         // Reset the start button appearance
         startBtn.classList.remove('listening-animation');
     };

     recognition.onresult = (event) => {
         let transcript = '';
         for (let i = event.resultIndex; i < event.results.length; i++) {
             transcript += event.results[i][0].transcript;
         }

         // Process the transcript
         transcript = processTranscript(transcript);

         if (isNewSession) {
             if (textField.value !== '') {
                 textField.value += '\n'; // Add a new line only if there is existing text
             }
             isNewSession = false; // Reset the flag
         }
         textField.value += transcript + ' ';

         // Save updated text to localStorage
         saveText();
     };

     recognition.onerror = (event) => {
         console.error('Speech recognition error detected: ' + event.error);
     };

     // Function to start recording
     function startRecording() {
         if (startBtn.disabled) return; // Do nothing if already recording
         isNewSession = true; // Set the flag when starting a new session
         recognition.start();
         startBtn.disabled = true;
         stopBtn.disabled = false;
     }

     // Function to stop recording
     function stopRecording() {
         if (stopBtn.disabled) return; // Do nothing if not recording
         recognition.stop();
         startBtn.disabled = false;
         stopBtn.disabled = true;
     }

     startBtn.addEventListener('click', () => {
         startRecording();
     });

     stopBtn.addEventListener('click', () => {
         stopRecording();
     });

     // Delete button functionality
     deleteBtn.addEventListener('click', () => {
         textField.value = '';
         localStorage.removeItem('transcribedText');
     });

     // Add event listener for keydown to handle Space key
     document.addEventListener('keydown', (event) => {
         // Check if the Space key is pressed and no modifier keys are active
         if (event.code === 'Space' && !event.ctrlKey && !event.altKey && !event.metaKey) {
             event.preventDefault(); // Prevent default scrolling behavior when pressing Space

             if (startBtn.disabled) {
                 // If recording is active, stop it
                 stopRecording();
             } else {
                 // If not recording, start it
                 startRecording();
             }
         }
     });

     // Initially disable the Stop button
     stopBtn.disabled = true;
 } else {
     // Speech Recognition not supported
     alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
 }