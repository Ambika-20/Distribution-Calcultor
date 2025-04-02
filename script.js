document.getElementById('solveButton').addEventListener('click', function() {
    const question = document.getElementById('question').value.toLowerCase().trim();
    const resultDiv = document.getElementById('result');

    let distributionType = '';
    let answer = '';

    // Regular Expressions
    const normalRegex = /mean\s*=\s*([\d.]+)\s*,\s*std\s*dev\s*=\s*([\d.]+)/i;
    const binomialRegex = /n\s*=\s*(\d+)\s*,\s*p\s*=\s*([\d.]+)/i;
    const poissonRegex = /lambda\s*=\s*([\d.]+)/i;
    const uniformRegex = /a\s*=\s*([\d.]+)\s*,\s*b\s*=\s*([\d.]+)/i;
    const exponentialRegex = /rate\s*=\s*([\d.]+)/i;
    const geometricRegex = /p\s*=\s*([\d.]+).*?(\d+)\w*\s*trial/i;

    if (question.includes('normal')) {
        distributionType = 'Normal Distribution';
        const match = question.match(normalRegex);
        if (match) {
            const mean = parseFloat(match[1]);
            const stdDev = parseFloat(match[2]);
            const valueMatch = question.match(/at\s*(\d+)/);
            const value = valueMatch ? parseFloat(valueMatch[1]) : mean;
            const z = (value - mean) / stdDev;

            answer = `Z-score at value ${value}: <strong>${z.toFixed(2)}</strong>`;
        } else {
            answer = 'Please provide mean and standard deviation in the format: mean=X, std dev=Y.';
        }
    } 
    else if (question.includes('binomial')) {
        distributionType = 'Binomial Distribution';
        const match = question.match(binomialRegex);
        if (match) {
            const n = parseInt(match[1]);
            const p = parseFloat(match[2]);
            const expectedSuccesses = n * p;
            answer = `Expected successes: <strong>${expectedSuccesses}</strong>`;
        } else {
            answer = 'Please provide n (number of trials) and p (probability of success) in the format: n=X, p=Y.';
        }
    } 
    else if (question.includes('poisson')) {
        distributionType = 'Poisson Distribution';
        const match = question.match(poissonRegex);
        if (match) {
            const lambda = parseFloat(match[1]);

            // Poisson probability calculations
            const p0 = (Math.pow(lambda, 0) * Math.exp(-lambda)) / factorial(0);
            const p1 = (Math.pow(lambda, 1) * Math.exp(-lambda)) / factorial(1);
            const pAtLeast1 = 1 - p0;

            answer = `
                <strong>Given λ = ${lambda}:</strong><br>
                - Probability of **0** breakdowns: <strong>${p0.toFixed(4)}</strong><br>
                - Probability of **1** breakdown: <strong>${p1.toFixed(4)}</strong><br>
                - Probability of **at least 1** breakdown: <strong>${pAtLeast1.toFixed(4)}</strong>
            `;
        } else {
            answer = 'Please provide lambda in the format: lambda=X.';
        }
    } 
    else if (question.includes('uniform')) {
        distributionType = 'Uniform Distribution';
        const match = question.match(uniformRegex);
        if (match) {
            const a = parseFloat(match[1]);
            const b = parseFloat(match[2]);
            if (a >= b) {
                answer = 'Invalid range. Ensure that a < b.';
            } else {
                const probability = 1 / (b - a);
                answer = `Probability of selecting any number in [${a}, ${b}] is <strong>${probability.toFixed(4)}</strong>`;
            }
        } else {
            answer = 'Please provide a and b in the format: a=X, b=Y.';
        }
    } 
    else if (question.includes('exponential')) {
        distributionType = 'Exponential Distribution';
        const match = question.match(exponentialRegex);
        if (match) {
            const rate = parseFloat(match[1]);
            const expectedTime = 1 / rate;
            answer = `Expected time until the next event: <strong>${expectedTime.toFixed(2)} units</strong>`;
        } else {
            answer = 'Please provide rate in the format: rate=X.';
        }
    } 
    else if (question.includes('geometric')) {
        distributionType = 'Geometric Distribution';
        const match = question.match(geometricRegex);
        if (match) {
            const p = parseFloat(match[1]);
            const k = parseInt(match[2]);
            const geometricProbability = p * Math.pow(1 - p, k - 1);
            answer = `Probability of first success on the ${k}th trial: <strong>${geometricProbability.toFixed(4)}</strong>`;
        } else {
            answer = 'Please provide p (probability of success) and trial number in the format: p=X, k=Y.';
        }
    } 
    else {
        distributionType = 'Unknown Distribution';
        answer = 'Please enter a question that specifies a distribution (normal, binomial, poisson, uniform, exponential, geometric).';
    }

    resultDiv.innerHTML = `<strong>Distribution Type:</strong> ${distributionType}<br>${answer}`;
});

// Helper function to calculate factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let fact = 1;
    for (let i = 2; i <= n; i++) {
        fact *= i;
    }
    return fact;
}
