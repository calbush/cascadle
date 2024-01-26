const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

let currentWordCoord = 3
let gameState = 'active'
let currentLetterCoord = 0
let requiredLetters = ['o', 't']
let currentLetters = []
let freebieUsed = false
let wordWithLastUniqueLetter

//DOM manipulation

const placeLetterInDOM = (wordCoord, letterCoord, letterToPlace) => {
    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)
    box.textContent = letterToPlace
}

const removeLetterFromDOM = (wordCoord, letterCoord) => {
    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)
    box.textContent = ''
}

const deleteWord = (wordCoord) => {
    const wordToDelete = document.getElementById(`word${wordCoord}`)
    const wordToDeleteChildNodes = wordToDelete.childNodes
    wordToDeleteChildNodes.forEach((node) => {
        node.textContent = ''
    })
}

const disableBtn = (btn) => {
    btn.disabled = true
}

const displayError = (errorText) => {
    const errorMessage = document.createElement('div')
    errorMessage.textContent = errorText
    errorMessage.classList.add('error')
    document.body.append(errorMessage)
    setTimeout(() => errorMessage.remove(), 1300)
}

//State management

const setCoords = (wordCoord, letterCoord) => {   
    currentWordCoord = wordCoord
    currentLetterCoord = letterCoord
}

const updateCurrentLetters = (updateArray, letter) => {
    if (letter){
        updateArray.push(letter)
        return
    }
    updateArray.pop()
}

const clearCurrentLetters = () => {
    currentLetters = []
}

const updateRequiredLetters = (arrayToUpdate, wordArray) => {
    const uniqueLetter = wordArray.filter(letter => !arrayToUpdate.includes(letter))
    requiredLetters = requiredLetters.concat(uniqueLetter)
    if (uniqueLetter.length > 1){
        wordWithLastUniqueLetter = currentWordCoord
    }
}

const useFreebie = () => {
    if (currentWordCoord === 3 || freebieUsed === true){
        return
    }
    freebieUsed = true
    deleteWord(currentWordCoord)
    setCoords(currentWordCoord - 1, 0)
    deleteWord(currentWordCoord)
    clearCurrentLetters()
    disableBtn(document.getElementById('freebie'))
    if (wordWithLastUniqueLetter == currentWordCoord){
        requiredLetters.pop()
    }

}

//Utility Functions
const verifyRequiredLetterUsage = (requiredLetters, lettersToCheck) => {
    return requiredLetters.every(letter => lettersToCheck.includes(letter))
}

const checkNewUniqueLetter = (requiredLetters, submittedWord) => {
    const uniqueLetters = submittedWord.filter(letter => !requiredLetters.includes(letter))
    return uniqueLetters.length <= 1
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
        //Need to verify if all rules have been met
        if(!verifyRequiredLetterUsage(requiredLetters, currentLetters)){
            displayError('required')
            return
        }
        if(!checkNewUniqueLetter(requiredLetters, currentLetters)){
            displayError('unique')
            return
        }
        checkDictionaryForWord(wordToCheck).then((response) => {
            const status = response.status
            if(status == 200){
                if(currentWordCoord == 7){
                    console.log('winner')
                    return
                }
                updateRequiredLetters(requiredLetters, currentLetters)
                currentLetters = []
                setCoords(currentWordCoord + 1, 0)
            }
            else if(status == 404){
                displayError('valid')
            } else console.log(status)
        })
    } else if (pressedKey.key == 'Backspace' && currentLetterCoord !== 0){
        updateCurrentLetters(currentLetters)
        removeLetterFromDOM(currentWordCoord, currentLetterCoord - 1)
        setCoords(currentWordCoord, currentLetterCoord - 1)
    }
}

const body = document.querySelector('body')
const freebieBtn = document.getElementById('freebie')
body.addEventListener('keydown', validKeyCheck)
freebieBtn.addEventListener('click', useFreebie)

