import wordBank from "./wordBank.txt";
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
        correctWord = wordArr[Math.floor(Math.random() * wordArr.length)]
    });

    return {wordList, correctWord};
};