import { Container } from "react-bootstrap"
import useEventListener from "@use-it/event-listener";
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

    const [isMKeyPressingDown, setIsMKeyPressingDown] = useState(false);

    useEventListener('keydown', (event) => {
        const numberKeyArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ','];
        const operationKeyArray = ['/', '*', '-', '+'];
        const key = event.key.toLowerCase();

        if (numberKeyArray.includes(key)) {
            //You can use comma instead of decimal point
            key === ',' ? typeActualNumber('.') : typeActualNumber(key);
        }

        if (operationKeyArray.includes(key)) {
            handleOperationButtonsClick(key);
        }

        if (key === 'enter') {
            handleOperationButtonsClick('=');
        }

        if (key === 'backspace') {
            cancelLastNumber();
        }

        if (key === 'delete') {
            clearDisplay();
        }

        if (key === 'm') {
            //Key combination: When you're keeping 'm' pressed, you can press other keys to use memory functions
            setIsMKeyPressingDown(true);
        }

        if (key === 'r' && isMKeyPressingDown) {
            getNumber();
        }

        if (key === 's' && isMKeyPressingDown) {
            handleSaveNumber();
        }

        if (key === 'c') {
            deleteNumber();
        }

    })

    useEventListener('keyup', (event) => {
        if (event.key.toLowerCase() === 'm') {
            setIsMKeyPressingDown(false);
        }
    })

    function typeActualNumber (value) {
        //Actual number is the number you can see on the display of the calculator
        let tempActualNumber = actualNumber;
        let newActualNumber;

        if (datasToCalculate.isLastClickOperation) {
            tempActualNumber = '';
        }

        if (value !== '.') {         
            if (actualNumber === '0') {
                //This solution provides that cannot be typing more than one '0',
                //if there isn't other number or decimal point on display
                newActualNumber = value;
            } else {
                newActualNumber = tempActualNumber + value;
            }
        } else {
            //Cannot be more than one decimal point in actual number
            if (!actualNumber.toString().includes('.')) {
                //When last click was click of an operation button (e.g +, *) actually number is not an empty string,
                //but in this case we can type a new number on display
                //(Temp actual number is empty string only if last click was click of an operation button)
                if (tempActualNumber === '') {
                    //If missing '0' before decimal point, will be displayed automatically
                    tempActualNumber = '0';
                }
                newActualNumber = tempActualNumber + value;
            } else {
                newActualNumber = tempActualNumber;
            }
        }

        //Number of characters is limited
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

    function handleOperationButtonsClick (value) {
        let newSequenceArray = JSON.parse(JSON.stringify(datasToCalculate.sequenceOfOperation));
        let isLastClickEquation = datasToCalculate.isLastClickEquation;
        let isOperationSymbolChange = false;
        let lastOperationSymbol;

        /*eslint-disable*/
        //Sequence of operation is stored in an array. When you click an operation button,
        //the value of actual number and symbol of operation button will be pushed into the array
        if (value !== '=' && datasToCalculate.isLastClickOperation === false || isLastClickEquation) {
            newSequenceArray.push(actualNumber);
            newSequenceArray.push(value);

            if (isLastClickEquation) {
                isOperationSymbolChange = true;
            }

            isLastClickEquation = false;
        
        //If you already pressed once '+', '-', '*', or '/' buttons,
        //the last operation symbol in the array will be changed to the new one
        } else if (value !== '=') {
            newSequenceArray.pop();
            newSequenceArray.push(value);
            isOperationSymbolChange = true;
        }
        /*eslint-enable*/

        if(value === '=') {
            //Only pressing of equality sign button will make empty the array of sequence of operation
            newSequenceArray = [];
            isLastClickEquation = true;
            lastOperationSymbol = '';
        } else {
            lastOperationSymbol = value;
        }
        
        //Every time when you have sequence of operation and you make a new operation
        //the entire sequence of operations is evaluated
        if(!isOperationSymbolChange) {
            if (value === '=' || datasToCalculate.sequenceOfOperation.length !== 0) {
                const sequenceOfSolution = JSON.parse(JSON.stringify(datasToCalculate.sequenceOfOperation));

                if (!datasToCalculate.isLastClickOperation) {
                    sequenceOfSolution.push(actualNumber);
                } else {
                    sequenceOfSolution.pop();
                }

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
            lastOperationSymbol
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
                setActualNumber(response.number);
            } else if (result.status === 404) {
                displayOtherMessage('Memory is empty')
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
                    <div className="operation-sequence-container">
                        {datasToCalculate.sequenceOfOperation.map((numberOrOperator, index) => (
                            <p key={`os${index}`}>{numberOrOperator}</p>
                        ))}
                    </div>
                    {!datasToCalculate.isLastClickOperation && otherMessage === '' &&
                        <p className="main-display">{actualNumber}</p>
                    }
                    {datasToCalculate.isLastClickOperation && otherMessage === '' &&
                        <p className="main-display">{actualNumber}{datasToCalculate.lastOperationSymbol}</p>
                    }
                    {otherMessage !== '' &&
                        <p className="main-display">{otherMessage}</p>
                    }
                </div>
                <div className="button-group">
                    <div className="upper-row-button-group">
                        <div className="memory-button-group">
                            <button className="btn btn-success" onClick={getNumber}>MR</button>
                            <button className="btn btn-success" onClick={handleSaveNumber}>MS</button>
                            <button className="btn btn-success" onClick={deleteNumber}>MC</button>
                        </div>
                        <div className="clear-button-group">
                            <button className="btn btn-danger" onClick={clearDisplay}>C</button>
                            <button className="btn btn-danger" onClick={cancelLastNumber}>&#8612;</button>
                        </div>
                    </div>
                    <div className="main-button-group">
                        <div className="number-decimal-button-group">
                            <div className="number-button-group">
                                <div className="n7-n9-button-group">
                                    <button
                                        value="7" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        7
                                    </button>
                                    <button 
                                        value="8" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        8
                                    </button>
                                    <button 
                                        value="9" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        9
                                    </button>
                                </div>
                                <div className="n4-n6-button-group">
                                    <button 
                                        value="4" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        4
                                    </button>
                                    <button 
                                        value="5" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        5
                                    </button>
                                    <button 
                                        value="6" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        6
                                    </button>
                                </div>
                                <div className="n1-n3-button-group">
                                    <button 
                                        value="1" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        1
                                    </button>
                                    <button 
                                        value="2" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        2
                                    </button>
                                    <button 
                                        value="3" 
                                        className="btn btn-primary" 
                                        onClick={(event) => typeActualNumber(event.target.value)}
                                    >
                                        3
                                    </button>
                                </div>
                            </div>
                            <div className="other-button-group">
                                <button 
                                    value="0" 
                                    className="btn btn-primary" 
                                    onClick={(event) => typeActualNumber(event.target.value)}
                                >
                                    0
                                </button>
                                <button
                                    value="." 
                                    className="btn btn-primary" 
                                    onClick={(event) => typeActualNumber(event.target.value)}
                                >
                                    .
                                </button>
                            </div>
                        </div>
                        <div className="operator-button-group">
                            <button 
                                value="/" 
                                className="btn btn-primary" 
                                onClick={(event) => handleOperationButtonsClick(event.target.value)}
                            >
                                /
                            </button>
                            <button 
                                value="*" 
                                className="btn btn-primary" 
                                onClick={(event) => handleOperationButtonsClick(event.target.value)}
                            >
                                *
                            </button>
                            <button 
                                value="-" 
                                className="btn btn-primary" 
                                onClick={(event) => handleOperationButtonsClick(event.target.value)}
                            >
                                -
                            </button>
                            <button 
                                value="+" 
                                className="btn btn-primary" 
                                onClick={(event) => handleOperationButtonsClick(event.target.value)}
                            >
                                +
                            </button>
                            <button
                                value="=" 
                                className="btn btn-danger" 
                                onClick={(event) => handleOperationButtonsClick(event.target.value)}
                            >
                                =
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}