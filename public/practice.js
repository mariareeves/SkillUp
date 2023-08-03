
console.log('practicejs')

const synth = window.speechSynthesis;
//Base url 
const BASE_URL = 'http://localhost:4000'

// *----------------*-------------* //
//timer
// add status bar
var time = document.getElementById("time");
var minute = document.getElementById("min");
var second = document.getElementById("sec");
var startButton = document.getElementById("start");
var resetButton = document.getElementById("reset");
var seti = undefined;
var mm = "25";
var ss = "00";

startButton.addEventListener("click", function start() {
    if (startButton.innerHTML === "START") {
        startButton.innerHTML = "PAUSE";
        mm = minute.value;
        ss = second.value;
        if (minute.value === "") minute.value = "00";
        if (second.value === "") second.value = "00";
        minute.setAttribute("disabled", true);
        second.setAttribute("disabled", true);
        seti = setInterval(function () {
            if (second.value > 0) {
                second.value -= 1;
                if (second.value < 10 && second.value >= 0) {
                    second.value = "0" + second.value;
                }
            }
            else if (minute.value > 0) {
                second.value = "59";
                minute.value -= 1;
                if (minute.value < 10 && minute.value >= 0) {
                    minute.value = "0" + minute.value;
                }
            }
            else {
                clearInterval(seti);
                setTimeout(function () {
                    alert("Time Out !");
                    res();
                }, 100);
            }
        }, 1000);
    }
    else {
        minute.removeAttribute("disabled");
        second.removeAttribute("disabled");
        startButton.innerHTML = "START";
        clearInterval(seti);
    }
});

resetButton.addEventListener("click", reset);

function reset() {
    clearInterval(seti);
    minute.value = mm;
    second.value = ss;
    minute.removeAttribute("disabled");
    second.removeAttribute("disabled");
    startButton.innerHTML = "START";
}


// *----------------*-------------* //

startButton.addEventListener('click', displayCards)

async function displayCards() {
    const contentDiv = document.getElementById('display-cards')
    contentDiv.innerHTML = `
    <div class="swiper">
             
    <div class="swiper-wrapper" id="add-cards">
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-scrollbar"></div>
    </div>
    `
    try {
        const res = await axios.get(`${BASE_URL}/api/favorites`);
        console.log('from displayCards', res.data);
        const addCards = document.getElementById('add-cards');
        res.data.forEach(card => {
            console.log('card in displayCard', card);
            const slide = document.createElement('div'); // Create a new swiper slide
            slide.classList.add('swiper-slide', 'px-4');
            slide.textContent = card.question; // Set the card content as the question

            addCards.appendChild(slide); // Append the new slide to the add-cards container
        });

        // Now that all slides are added, initialize the swiper
        const swiper = new Swiper('.swiper', {
            // Optional parameters
            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // And if we need scrollbar
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });

    } catch (error) {
        console.error('Error fetching flashcards:', error);
    };

    // *----------------*-------------* //
    //web speech api 
    let voices = []

    synth.onvoiceschanged = function () {
        voices = synth.getVoices()
        console.log('Voices', voices)
    }

    function speakCard(text) {
        const utterThis = new SpeechSynthesisUtterance(text);
        if (voices.length > 0) {
            const voice = voices[0];
            console.log('voice', voice);
            utterThis.voice = voice;
            utterThis.pitch = 1;
            utterThis.rate = 0.8;
            synth.speak(utterThis);
            console.log('utterThis', utterThis);
        } else {
            console.log('it didnt work');
        }
    }
    const soundBtn = document.getElementById('soundBtn');
    const question = document.getElementById('question');


    soundBtn.addEventListener('click', function () {
        speakCard(question.textContent); // Pass the text content of the question div
    });
}





