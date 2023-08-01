console.log('test mainjs')
//Base url 
const BASE_URL = 'http://localhost:4000'

const synth = window.speechSynthesis;
// *----------------*-------------* //

// GET flashcards
const behavioralList = document.getElementById('behavioral-flashcards')
const technicalList = document.getElementById('technical-flashcards')
const createBtn = document.getElementById('create')

// display cards
function displayCards() {

  axios.get(`${BASE_URL}/api/flashcards`)
    .then(res => {
      console.log('from displayCards', res.data)
      res.data.forEach(card => {
        console.log('from each inside displayCards', card)

        //random colors from tailwindcss
        const cardColors = ['bg-pink-100',
          'bg-yellow-100',
          'bg-sky-100',
          'bg-green-100']
        // Calculate the random index
        const randomIndex = Math.floor(Math.random() * cardColors.length);
        const randomColor = cardColors[randomIndex]; //add the random index to the colors array
        const cardElement = `
          <div data-card-id="${card.flashcard_id}" class="h-64 w-64 m-8 cursor-pointer group perspective">
            <div class="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-1000 flex justify-center shadow-lg">
              <div class="absolute backface-hidden w-full h-full flex flex-col items-center ${randomColor}">
                <h2 class="flex-grow text-center text-gray-800 font-semibold flex items-center justify-center px-4 text-lg tracking-wider">
                  ${card.question}
                </h2>
              </div>
              <div class="absolute my-rotate-y-180 backface-hidden w-full h-full ${randomColor} overflow-hidden flex flex-col items-center">
                <h2 class="flex-grow text-center text-gray-800 font-semibold flex items-center justify-center px-4 text-[10px]">
                  ${card.answer}
                </h2>
              </div>
            </div>
            <div class="flex justify-center gap-4 mt-3">
                <a href="updateCards.html?${card.flashcard_id}" class="flex p-3 bg-green-500 rounded-xl hover:rounded-3xl hover:bg-green-600 transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                </a>
                <button onclick="deleteCard(${card.flashcard_id})"    class="flex p-3 bg-sky-500 rounded-xl hover:rounded-3xl hover:bg-sky-600 transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
                </button>
                <button onclick="favoriteCard(${card.flashcard_id}, '${card.question}')"  class="flex p-3 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
</svg></button>
            </div>
        </div>

      
        `;


        if (card.category === 'behavioral') {
          behavioralList.innerHTML += cardElement;
        } else if (card.category === 'technical') {
          technicalList.innerHTML += cardElement;
        }


      });
    })
    .catch(error => {
      console.error('Error fetching flashcards:', error);
    });
}


function deleteCard(id) {
  console.log('id in deleteCard', id)
  axios.delete(`${BASE_URL}/api/flashcards/${id}`)
    .then(() => {
      console.log('deleted!')
      // Find the card element with the corresponding data-card-id attribute
      const cardElement = document.querySelector(`[data-card-id="${id}"]`);
      if (cardElement) {
        // Remove the card element from its parent node
        cardElement.parentNode.removeChild(cardElement);
      }
    })
    .catch(err => console.log(err))
}

// favorite card
let favoritedCards = []

function favoriteCard(flashcardId, question) {
  console.log('card id', flashcardId)
  console.log('card question', question)

  const cardIndex = favoritedCards.findIndex((favCard) => favCard.flashcard_id === flashcardId);

  if (cardIndex !== -1) {
    // Card already favorited, so remove it
    favoritedCards.splice(cardIndex, 1);
  } else {
    // Card not favorited yet, so add it
    favoritedCards.push({ flashcard_id: flashcardId, question: question });
  }

  console.log('favorite cards', favoritedCards)
}




displayCards()
