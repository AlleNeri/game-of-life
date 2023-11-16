import React, { useState, useEffect } from 'react';
import './App.css'

type BoardGame = boolean[][]

function isTheCurrentCell(rowIndex: number, cellIndex: number, currentRowIndex: number, currentCellIndex: number): boolean {
	return rowIndex === currentRowIndex && cellIndex === currentCellIndex;
}

function isAliveTheNeighbour(boardGame: BoardGame, rowIndex: number, cellIndex: number): boolean {
	return boardGame[rowIndex] && boardGame[rowIndex][cellIndex];
}

function getNeighbours(boardGame: BoardGame, rowIndex: number, cellIndex: number): number {
	let neighbours = 0;
	for (let i = rowIndex - 1; i <= rowIndex + 1; i++) for (let j = cellIndex - 1; j <= cellIndex + 1; j++) {
			if(isTheCurrentCell(rowIndex, cellIndex, i, j)) continue;
			if (isAliveTheNeighbour(boardGame, i, j)) neighbours++;
		}
	return neighbours;
}

// funzione per vedere se una cella dovrà vivere alla prossima generazione nel gioco della vita
function isAlive(boardGame: BoardGame, rowIndex: number, cellIndex: number): boolean {
	const cell = boardGame[rowIndex][cellIndex];
	const neighbours = getNeighbours(boardGame, rowIndex, cellIndex);
	if (cell) return neighbours === 2 || neighbours === 3;
	else return neighbours === 3;
}

function App() {
	const [ boardGame, setBoardGame ] = useState<BoardGame>([])
	const [ generation, setGeneration ] = useState<number>(0)
	const [ isRunning, setIsRunning ] = useState<boolean>(false)

	let interval: any = null;

	const initInterval = () => {
		interval = setInterval(() => {
			setBoardGame((boardGame) => {
				return boardGame.map((row, rowIndex) => {
					return row.map((_, cellIndex) => {
						if (isAlive(boardGame, rowIndex, cellIndex)) return true;
						else return false;
					});
				});
			});
			setGeneration(generation => generation + 1);
		}, 3000);
	}

	useEffect(() => {
		const initialBoard = Array(20).fill(Array(20).fill(false));
		setBoardGame(initialBoard);
		initInterval();
		setIsRunning(true);
		return () => clearInterval(interval);
	}, []);	// [] is the dependency array, if it is empty, it will only run once

	//stop the game
	useEffect(() => {
		if (!isRunning) clearInterval(interval);
		else initInterval();
	}, [isRunning]);

	return <>
		<h2>The Game of Life</h2>
		{
			boardGame.map((row, rowIndex) => (
				<div key={rowIndex}>
					{row.map((cell, cellIndex) => (
						<div
							key={cellIndex}
							onClick={() => {
								const newBoardGame = boardGame.map((row) => [ ...row ]);
								newBoardGame[rowIndex][cellIndex] = !newBoardGame[rowIndex][cellIndex];
								setBoardGame(newBoardGame);
							}}
							style={{
								width: '20px',
								height: '20px',
								backgroundColor: cell ? 'black' : 'white',
								border: '1px solid black',
								display: 'inline-block'
							}}
						/>
					))}
				</div>
		))}
		<p>Generazione: {generation}</p>
		<button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Stop' : 'Start'}</button>
	</>;
}

export default App
