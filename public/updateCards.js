console.log('update js')

//Base url 
const BASE_URL = 'http://localhost:4000'

// POST flashcards
// Create Form
const formCards = document.getElementById('form-cards')
const questionInput = document.getElementById('question')
const textareaAnswer = document.getElementById('answer')
const updatelBtn = document.getElementById('update')
const cancelBtn = document.getElementById('cancel')


// Function to get the flashcard ID from the URL query parameters
function getFlashcardIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("flashcardId");
}

// Function to retrieve the flashcard details from the backend based on the ID
function getFlashcardDetails(flashcardId) {
  return axios.get(`${BASE_URL}/api/flashcards/${flashcardId}`);
}

// Function to update the flashcards
function updateCards(evt) {
  evt.preventDefault();

  const flashcardId = getFlashcardIdFromUrl();
  if (!flashcardId) {
    console.error("Flashcard ID not found in URL query parameters.");
    return;
  }

  let body = {
    question: questionInput.value,
    answer: textareaAnswer.value,
  };

  questionInput.value = '';
  textareaAnswer.value = '';

  axios
    .put(`${BASE_URL}/api/flashcards/${flashcardId}`, body)
    .then((res) => {
      alert('Flashcard updated successfully.');
      console.log('Update function front end', res);
      // Optionally, you can redirect the user back to the main page or do something else after the update.
      // For example: window.location.href = "main.html";
    })
    .catch((err) => console.log('Error coming from the front end update function', err));
}

// On page load, fetch the flashcard details based on the ID in the URL and populate the form with the existing data
document.addEventListener('DOMContentLoaded', function () {
  const flashcardId = getFlashcardIdFromUrl();
  if (flashcardId) {
    getFlashcardDetails(flashcardId)
      .then((res) => {
        const flashcard = res.data;
        questionInput.value = flashcard.question;
        textareaAnswer.value = flashcard.answer;
      })
      .catch((err) => console.log('Error fetching flashcard details', err));
  }
});


// form event listener 
formCards.addEventListener('submit', updateCards)

