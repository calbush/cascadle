const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

let currentWordCoord = 3
let currentLetterCoord = 0
let requiredLetters = ['a', 'n']
let currentLetters = []

//DOM manipulation

const placeLetterInDOM = (wordCoord, letterCoord, letterToPlace) => {
    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)
    box.textContent = letterToPlace
}

const removeLetterFromDOM = (wordCoord, letterCoord) => {
    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)
    box.textContent = ''
}

//State management

const setCoords = (wordCoord, letterCoord) => {   
    currentWordCoord = wordCoord
    currentLetterCoord = letterCoord
}

const updateCurrentLetters = (array, letter) => {
    if (letter){
        if(array.includes(letter)){
            return
        }
        array.push(letter)
        return
    }
    array.pop()
}

// const updateRequiredLetters = (required, wordArray) => {
//     wordArray.forEach((letter) => {
//         if (!required.includes(letter)){

//         }
//     })
// }

//Utility Functions

const verifyRequiredLetterUsage = (requiredLetters, lettersToCheck) => {
    //Update this function. ForEach is not appropriate here.
    //Make sure each unique letter is in the submitted word.
    requiredLetters.forEach((letter) => {
        if (!lettersToCheck.includes(letter)){
            return
        }
    })
    return true
} 

async function checkDictionaryForWord(word){
    const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    return result
}

const validKeyCheck = (pressedKey) => {
    const uppercaseKey = pressedKey.key.toUpperCase()
    
    if (alphabet.includes(pressedKey.key.toLowerCase())){
        if (currentLetterCoord < currentWordCoord){
            updateCurrentLetters(currentLetters, pressedKey.key.toLowerCase())
            placeLetterInDOM(currentWordCoord, currentLetterCoord, uppercaseKey)
            setCoords(currentWordCoord, currentLetterCoord + 1)

        }
    } else if (pressedKey.key == 'Enter' && currentLetterCoord >= currentWordCoord){
        const wordToCheck = currentLetters.join('')
        //Need to verify if required letters are used and it's a valid word
        if(verifyRequiredLetterUsage(requiredLetters, currentLetters)){
            checkDictionaryForWord(wordToCheck).then((response) => {
                const status = response.status
                if(status == 200){
                    
                    currentLetters = []
                    setCoords(currentWordCoord + 1, 0)
                }
                else if(status == 404){
                    console.log('invalid')
                } else console.log(status)
            })
        }
    } else if (pressedKey.key == 'Backspace' && currentLetterCoord !== 0){
        updateCurrentLetters(currentLetters)
        removeLetterFromDOM(currentWordCoord, currentLetterCoord - 1)
        setCoords(currentWordCoord, currentLetterCoord - 1)
    }
}

const body = document.querySelector('body')
body.addEventListener('keydown', validKeyCheck)

/*
    If a key is pressed. (event listener) ->
        if key is in alphabet ->
            if 'letter' coordinate is not >= current word coord (three letter word would have valid letter coords [0,1,2])
                place letter at div with [coords] ([word coord, letter coord])
                set letter coords to current coord +1
        else if key is 'enter' AND letter coord >= word coord ->
            make API call
            if unsuccessful display error
            if successful ->
                change required letters
                set current word to currentWord +1
                set current letter coord to 0
                checkGameStatus()
        else if key is 'backspace' AND letter coord is not == 0
            set letter coord to current letter coord - 1 
*/