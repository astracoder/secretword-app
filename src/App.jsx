import { carsList } from './data/cars.js';
import { useCallback, useEffect, useState } from 'react';

import StartGame from './components/StartGame/StartGame.jsx';
import Game from './components/Game/Game.jsx';
import EndGame from './components/EndGame/EndGame.jsx';

import guessedSound from './assets/guessed.mp3';
import wrongSound from './assets/wrong.mp3';
import backgroundSound from './assets/background.mp3';

const stages = [
    {id: 1, name: 'start'},
    {id: 2, name: 'ingame'},
    {id: 3, name: 'end'}
]

const App = () => {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [cars] = useState(carsList);

    const [pickedBrand, setPickedBrand] = useState('');
    const [pickedModel, setPickedModel] = useState('');
    const [letters, setLetters] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [chances, setChances] = useState(3);
    const [score, setScore] = useState(0);

    const guessedSoundPlay = () => {
        new Audio(guessedSound).play();
    }

    const wrongSoundPlay = () => {
        new Audio(wrongSound).play();
    }

    const backgroundSoundPlay = () => {
        const setBackgroundSound = new Audio(backgroundSound);
        setBackgroundSound.volume = 0.1;
        
        setBackgroundSound.addEventListener('loadeddata', () => {
            setBackgroundSound.play();
        })
    }

    backgroundSoundPlay();

    const getBrandAndModel = () => {
        //Pegando a 'chave' do obj 
        const brands = Object.keys(cars);
        const brand = brands[Math.floor(Math.random() * brands.length)];

        //Pegando os valores da chave
        const models = cars[brand];
        const model = models[Math.floor(Math.random() * models.length)];
        
        return [brand, model];
    }

    const startGame = () => {
        clearAllStates();

        const [brand, model] = getBrandAndModel();
        let modelLetters = model.split('');
        modelLetters = modelLetters.map(l => l.toUpperCase());

        setPickedBrand(brand);
        setPickedModel(model);
        setLetters(modelLetters);

        setGameStage(stages[1].name);
    }

    const verifyLetter = (letterGame) => {
        if(guessedLetters.includes(letterGame) || wrongLetters.includes(letterGame)) {
            return;
        }

        if(letters.includes(letterGame)) {
            setGuessedLetters(currentGuessedLetters => [
                ...currentGuessedLetters,
                letterGame
            ]);

            guessedSoundPlay();

            setScore(currentScore => currentScore += 50);
        } else {
            setWrongLetters(currentWrongLetters => [
                ...currentWrongLetters,
                letterGame
            ]);

            wrongSoundPlay();

            setChances(currentChances => currentChances - 1);
        }
    }

    const retryStage = () => {
        setScore(0);
        setChances(3);
        setGameStage(stages[0].name)
    }

    const clearAllStates = () => {
        setGuessedLetters([]);
        setWrongLetters([]);
    }

    useEffect(() => {
        if(chances <= 0) {
            clearAllStates()
            setGameStage(stages[2].name);
        }
    }, [chances]);

    useEffect(() => {
        const uniqueLetters = [...new Set(letters)]
        
        if(uniqueLetters.length === guessedLetters.length && gameStage === stages[1].name) {
            setScore(currentScore => (currentScore += 100));
            startGame();
        }
    }, [guessedLetters]);

    return (
        <>
            {gameStage === 'start' && 
            <StartGame 
                startGame={startGame}
            />}
            {gameStage === 'ingame' && 
            <Game 
                verifyLetter={verifyLetter}
                pickedBrand={pickedBrand}
                pickedModel={pickedModel}
                letters={letters}
                guessedLetters={guessedLetters}
                wrongLetters={wrongLetters}
                chances={chances}
                score={score}
            />}
            {gameStage === 'end' && 
            <EndGame 
                retryStage={retryStage}
                score={score}
            />}
        </>
    )
}

export default App;