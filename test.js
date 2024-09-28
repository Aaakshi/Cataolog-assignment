const fs = require('fs');

// Function to decode the y-values based on the given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to calculate the Lagrange interpolation at x = 0 to find the constant term 'c'
function lagrangeInterpolation(xValues, yValues, k) {
    let result = 0;
    for (let i = 0; i < k; i++) {
        let term = yValues[i];
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= (0 - xValues[j]) / (xValues[i] - xValues[j]);
            }
        }
        result += term;
    }
    return result;
}

// Main function to read JSON input and solve for 'c'
function findSecret(filePath) {
    // Read the input JSON file
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    jsonData.forEach((testCase, index) => {
        const n = testCase.keys.n;
        const k = testCase.keys.k;

        const xValues = [];
        const yValues = [];

        // Extract x-values and decode y-values
        for (let i = 1; i <= n; i++) {
            if (testCase[i]) {
                const base = parseInt(testCase[i].base);
                const value = testCase[i].value;
                xValues.push(i); // The x-values are the keys "1", "2", "3", etc.
                yValues.push(decodeValue(value, base)); // Decode the y-value using the specified base
            }
        }

        // Ensure we only take the first 'k' points for Lagrange interpolation
        const xSubset = xValues.slice(0, k);
        const ySubset = yValues.slice(0, k);

        // Calculate the constant term 'c' using Lagrange interpolation
        const constantTerm = lagrangeInterpolation(xSubset, ySubset, k);
        console.log(`Test Case ${index + 1}: The constant term 'c' of the polynomial is: ${constantTerm}`);
    });
}

// Run the function with your input file path
findSecret('input.json');
