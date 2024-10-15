#include <stdio.h>
#include <ctype.h>
#include <time.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

#define MAX_INPUT_SIZE 100

char* input_handler() {
    char* letter = malloc(MAX_INPUT_SIZE + 1);
    if (letter == NULL) {
        printf("Memory allocation failed\n");
        exit(1);
    }

    printf("Please, enter the phrase (max %d characters):\n", MAX_INPUT_SIZE);
    fgets(letter, MAX_INPUT_SIZE + 1, stdin);
    letter[strcspn(letter, "\n")] = '\0';
    return letter;
}

int encryption() {
    int salt;
    printf("Enter encryption key: \n");
    scanf(" %d", &salt);
    printf("-------------------------------------\n");
    return salt;
}

char caesar(char* word, int salt) {
    for (int i = 0; i < strlen(word); ++i) {
        if (word[i]) {
            int asciiValue = (int)word[i];
            int coded_letter = asciiValue + salt;

            while (coded_letter > 122) {
                coded_letter = 65 + (coded_letter - 123);
            }
            while (coded_letter < 65) {
                coded_letter = 122 - (64 - coded_letter);
            }

            word[i] = (char)coded_letter;
        }
    }

    printf("Encrypted phrase: %s\n\n", word);

    for (int i = 0; i < strlen(word); ++i) {
        if (word[i]) {
            int asciiValue = (int)word[i];
            int coded_letter = asciiValue - salt;

            while (coded_letter > 122) {
                coded_letter = 65 + (coded_letter - 123);
            }
            while (coded_letter < 65) {
                coded_letter = 122 - (64 - coded_letter);
            }

            word[i] = (char)coded_letter;
        }
    }

    printf("Decrypted phrase: %s", word);
}

int main() {
    char* word = input_handler();
    int key = encryption();
    caesar(word, key);
    free(word);
    return 0;
}
