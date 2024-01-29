const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

let currentWordCoord = 3
let gameState = 'active'
let currentLetterCoord = 0
let requiredLetters = ['O', 'T']
let currentLetters = []
let freebieUsed = false

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
    setTimeout(() => errorMessage.remove(), 1400)
}

const postRequiredLettersToDOM = () => {
    const requiredLettersElement = document.getElementById('required')
    const currentLettersElements = document.querySelectorAll('.required-letter')
    if (currentLettersElements.length !== requiredLetters.length){
        currentLettersElements.forEach((element) => {
            element.remove()
        })
        requiredLetters.forEach((letter) => {
            const requiredLetter = document.createElement('li')
            requiredLetter.classList.add('required-letter')
            requiredLetter.textContent = letter
            requiredLettersElement.append(requiredLetter)
        })
    }
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

const updateRequiredLetters = (arrayToUpdate, wordArray) => {
    const uniqueLetter = wordArray.filter(letter => !arrayToUpdate.includes(letter))
    requiredLetters = requiredLetters.concat(uniqueLetter)
}

const useFreebie = () => {
    if (currentWordCoord === 3 || freebieUsed === true){
        return
    }
    freebieUsed = true
    deleteWord(currentWordCoord)
    setCoords(currentWordCoord - 1, 0)
    deleteWord(currentWordCoord)
    const previousWordChildren = document.getElementById(`word${currentWordCoord - 1}`).children
    const previousWordLetters = Array.from(previousWordChildren, (element) => element.innerText)
    requiredLetters = previousWordLetters.filter((letter, index) => previousWordLetters.indexOf(letter) === index)
    postRequiredLettersToDOM()
    disableBtn(document.getElementById('freebie'))
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
    if (alphabet.includes(uppercaseKey)){
        if (currentLetterCoord < currentWordCoord){
            updateCurrentLetters(currentLetters, uppercaseKey)
            placeLetterInDOM(currentWordCoord, currentLetterCoord, uppercaseKey)
            setCoords(currentWordCoord, currentLetterCoord + 1)
        }
    } else if (pressedKey.key == 'Enter' && currentLetterCoord >= currentWordCoord){
        const wordToCheck = currentLetters.join('')
        //Need to verify if all rules have been met
        if(!verifyRequiredLetterUsage(requiredLetters, currentLetters)){
            displayError('Must use all required letters')
            return
        }
        if(!checkNewUniqueLetter(requiredLetters, currentLetters)){
            displayError('Maximum of 1 new unique letter per word')
            return
        }
        checkDictionaryForWord(wordToCheck).then((response) => {
            const status = response.status
            if(status == 200){
                if(currentWordCoord == 7){
                    return
                }
                updateRequiredLetters(requiredLetters, currentLetters)
                postRequiredLettersToDOM()
                currentLetters = []
                setCoords(currentWordCoord + 1, 0)
            }
            else if(status == 404){
                displayError('Couldn\'t find a valid word matching that spelling')
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
postRequiredLettersToDOM()
body.addEventListener('keydown', validKeyCheck)
freebieBtn.addEventListener('click', useFreebie)

