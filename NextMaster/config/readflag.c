#include <stdio.h>

int main() {
    char flag[256];
    FILE *fp = fopen("/flag.txt", "r");  
    fgets(flag, 256, fp);
    puts(flag);
    fclose(fp);
    return 0;
}