import wordBank from "./wordBank.txt";
import validWord from "./chooseableWords.txt";
export const wordMatrix = [
    ["", "", "", "", ""], 
    ["", "", "", "", ""], 
    ["", "", "", "", ""], 
    ["", "", "", "", ""], 
    ["", "", "", "", ""], 
    ["", "", "", "", ""], 
];

export const getWordList = async () => {
    let wordList;
    let correctWord;

    await fetch(wordBank)
        .then((response) => response.text())
        .then((result) => {
        const wordArr = result.split("\n");
        wordList = new Set(wordArr);
    });
    
    await fetch(validWord)
        .then((response) => response.text())
        .then((result) => {
        const wordArr = result.split("\n");
        correctWord = wordArr[Math.floor(Math.random() * wordArr.length)]
    });

    return {wordList, correctWord};
};