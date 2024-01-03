const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

let currentWordCoord = 3
let currentLetterCoord = 0


const btn = document.getElementById('btn')
btn.addEventListener('click', () => checkWord())

const captureContent = () => {
    const text = document.getElementById('word').value
    return text
}

const placeLetter = (wordCoord, letterCoord, letterToPlace) => {
    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)
    box.textContent = letterToPlace
}

const removeLetter = (wordCoord, letterCoord) => {
    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)
    box.textContent = ''
}

const setCoords = (wordCoord, letterCoord) => {   
    currentWordCoord = wordCoord
    currentLetterCoord = letterCoord
}

async function checkWord(){
    const wordToCheck = captureContent()
    const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToCheck}`)
    console.log(result)
    return result
}

const validKeyCheck = (pressedKey) => {
    console.log(pressedKey.key)
    console.log('word: ', currentWordCoord)
    console.log('letter: ', currentLetterCoord)

    const uppercaseKey = pressedKey.key.toUpperCase()
    
    if (alphabet.includes(pressedKey.key.toLowerCase())){
        if (currentLetterCoord < currentWordCoord){
            placeLetter(currentWordCoord, currentLetterCoord, uppercaseKey)
            setCoords(currentWordCoord, currentLetterCoord + 1)
        }
    } else if (pressedKey.key == 'Enter' && currentLetterCoord >= currentWordCoord){
        console.log('full')
        setCoords(currentWordCoord + 1, 0)
    } else if (pressedKey.key == 'Backspace' && currentLetterCoord !== 0){
        removeLetter(currentWordCoord, currentLetterCoord - 1)
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