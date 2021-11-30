import safeEval from 'safe-eval';

export default function calculateSolution (sequenceOfOperation) {
    let solution;
    let stringToSolution = '';

    sequenceOfOperation.forEach((numberOrOperator) => {
        stringToSolution = stringToSolution + numberOrOperator
    })

    solution = safeEval(stringToSolution);

    return solution
}