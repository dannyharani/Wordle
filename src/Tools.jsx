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

    await fetch(wordBank)
        .then((response) => response.text())
        .then((result) => {
        const wordArr = result.split("\n");
        wordList = new Set(wordArr);
    });

    return {wordList};
};