#include <stdio.h>

// Function to add two numbers
int add(int a, int b) {
    return a + b;
}

// Function to subtract two numbers
int subtract(int a, int b) {
    return a - b;
}

int main() {
    int num1, num2;
    
    // Input two integers
    printf("Enter two integers: ");
    scanf("%d %d", &num1, &num2);
    
    // Perform addition and subtraction
    int sum = add(num1, num2);
    int difference = subtract(num1, num2);
    
    // Display results
    printf("Sum: %d\n", sum);
    printf("Difference: %d\n", difference);

    return 0;
}
