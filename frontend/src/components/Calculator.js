import { Container } from "react-bootstrap";
import { useState } from "react";

import calculateSolution from "../utils/calculateSolution";
import { memoryEndpoint } from "../utils/endpoint";
import requestToBackend from "../utils/requestToBackend";

export default function Calculator () {

    const [datasToCalculate, setDatasToCalculate] = useState({
        sequenceOfOperation: [],
        isLastClickOperation: false,
        isLastClickEquation: false,
        lastOperationSymbol: '',
    })

    const [actualNumber, setActualNumber] = useState('0');
    const [otherMessage, setOtherMessage] = useState('');

    function typeActualNumber (event) {        
        const value = event.target.value;
        let tempActualNumber = actualNumber;
        let newActualNumber;

        if (datasToCalculate.isLastClickOperation) {
            tempActualNumber = '';
        }

        if (value !== '.') {         
            if (actualNumber === '0') {
                newActualNumber = value;
            } else {
                newActualNumber = tempActualNumber + value;
            }
        } else {
            if (!actualNumber.toString().includes('.')) {
                if (tempActualNumber === '') {
                    tempActualNumber = '0';
                }
                newActualNumber = tempActualNumber + value;
            } else {
                newActualNumber = tempActualNumber;
            }
        }

        if (newActualNumber.length <= 24) {
            setActualNumber(newActualNumber);
        }

        setDatasToCalculate({
            ...datasToCalculate,
            isLastClickOperation: false,
            isLastClickEquation: false,
        })

        setOtherMessage('');

    }

    function clearDisplay () {
        setDatasToCalculate({
            ...datasToCalculate,
            isLastClickOperation: false,
            isLastClickEquation: false,
            sequenceOfOperation: []
        })
        setActualNumber('0');
        setOtherMessage('');
    }

    function cancelLastNumber () {
        setDatasToCalculate({
            ...datasToCalculate,
            isLastClickOperation: false,
            isLastClickEquation: false
        })

        let newActualNumber;

        if(actualNumber.length > 1) {
            newActualNumber = actualNumber.slice(0, -1);
        } else {
            newActualNumber = '0';
        }

        setActualNumber(newActualNumber);
        setOtherMessage('');
    }

    function handleOperationButtonsClick (event) {
        const value = event.target.value;
        let newSequenceArray = JSON.parse(JSON.stringify(datasToCalculate.sequenceOfOperation));
        let isLastClickEquation = datasToCalculate.isLastClickEquation;
        let isOperationSymbolChange = false;

        /*eslint-disable*/
        if (value !== '=' && datasToCalculate.isLastClickOperation === false || isLastClickEquation) {
            newSequenceArray.push(actualNumber);
            newSequenceArray.push(value);

            if (isLastClickEquation) {
                isOperationSymbolChange = true;
            }

        } else if (value !== '=') {
            newSequenceArray.pop();
            newSequenceArray.push(value);
            isOperationSymbolChange = true;
        }
        /*eslint-enable*/

        if(value === '=') {
            newSequenceArray = [];
            isLastClickEquation = true;
        }
        
        if(!isOperationSymbolChange) {
            if (value === '=' || datasToCalculate.sequenceOfOperation.length !== 0) {
                const sequenceOfSolution = JSON.parse(JSON.stringify(datasToCalculate.sequenceOfOperation));
                sequenceOfSolution.push(actualNumber)
                const solution = calculateSolution(sequenceOfSolution);

                if (solution === Infinity) {
                    clearDisplay();
                    setOtherMessage('You cannot divide by zero');
                    return
                }

                setActualNumber(solution);
            }
        }

        setDatasToCalculate({
            ...datasToCalculate,
            isLastClickOperation: true,
            isLastClickEquation,
            sequenceOfOperation: newSequenceArray,
            lastOperationSymbol: value
        })

        setOtherMessage('');
    }

    function displayOtherMessage(message) {
        setOtherMessage(message);

        setTimeout(() => {
            setOtherMessage('');
        }, 1500);
    }

    async function handleSaveNumber () {
        const number = Number(actualNumber);

        const dataToBackend = {
            number
        }

        try {
            const result = await requestToBackend('POST', memoryEndpoint, dataToBackend);

            if (result.ok) {
                displayOtherMessage('Number saved');
            }
        } catch (err) {
            displayOtherMessage('An error occurred')
            console.error(err);
        }
    }

    async function getNumber() {
        try {
            const result = await requestToBackend('GET', memoryEndpoint);

            if(result.ok) {
                const response = await result.json();
                clearDisplay();
                setActualNumber(response.number);
            } else if (result.status === 404) {
                displayOtherMessage('Memory is clear')
            }
        } catch (err) {}
    }

    async function deleteNumber () {
        try {
            const result = await requestToBackend('DELETE', memoryEndpoint);

            if (result.ok) {
                displayOtherMessage('Memory has been cleared')
            }
        } catch (err) {}
    }
    
    return (
        <Container>
            <div className="calculator">
                <div className="display">
                    {!datasToCalculate.isLastClickOperation && otherMessage === '' &&
                        <p>{actualNumber}</p>
                    }
                    {datasToCalculate.isLastClickOperation && otherMessage === '' &&
                        <p>{actualNumber}{datasToCalculate.lastOperationSymbol}</p>
                    }
                    {otherMessage !== '' &&
                        <p>{otherMessage}</p>
                    }
                </div>
                <div className="buttons">
                    <div className="upper-row-buttons">
                        <div className="memory-buttons">
                            <button className="btn btn-success" onClick={getNumber}>MR</button>
                            <button className="btn btn-success" onClick={handleSaveNumber}>MS</button>
                            <button className="btn btn-success" onClick={deleteNumber}>MC</button>
                        </div>
                        <div className="clear-buttons">
                            <button className="btn btn-danger" onClick={clearDisplay}>C</button>
                            <button className="btn btn-danger" onClick={cancelLastNumber}>&#8612;</button>
                        </div>
                    </div>
                    <div className="main-buttons">
                        <div className="number-decimal-buttons">
                            <div className="number-buttons">
                                <div className="n7-n9-buttons">
                                    <button value="7" className="btn btn-primary" onClick={typeActualNumber}>7</button>
                                    <button value="8" className="btn btn-primary" onClick={typeActualNumber}>8</button>
                                    <button value="9" className="btn btn-primary" onClick={typeActualNumber}>9</button>
                                </div>
                                <div className="n4-n6-buttons">
                                    <button value="4" className="btn btn-primary" onClick={typeActualNumber}>4</button>
                                    <button value="5" className="btn btn-primary" onClick={typeActualNumber}>5</button>
                                    <button value="6" className="btn btn-primary" onClick={typeActualNumber}>6</button>
                                </div>
                                <div className="n1-n3-buttons">
                                    <button value="1" className="btn btn-primary" onClick={typeActualNumber}>1</button>
                                    <button value="2" className="btn btn-primary" onClick={typeActualNumber}>2</button>
                                    <button value="3" className="btn btn-primary" onClick={typeActualNumber}>3</button>
                                </div>
                            </div>
                            <div className="other-buttons">
                                <button value="0" className="btn btn-primary" onClick={typeActualNumber}>0</button>
                                <button value="." className="btn btn-primary" onClick={typeActualNumber}>.</button>
                            </div>
                        </div>
                        <div className="operator-buttons">
                            <button value="/" className="btn btn-primary" onClick={handleOperationButtonsClick}>/</button>
                            <button value="*" className="btn btn-primary" onClick={handleOperationButtonsClick}>*</button>
                            <button value="-" className="btn btn-primary" onClick={handleOperationButtonsClick}>-</button>
                            <button value="+" className="btn btn-primary" onClick={handleOperationButtonsClick}>+</button>
                            <button value="=" className="btn btn-danger" onClick={handleOperationButtonsClick}>=</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}