import sys
def fibonacci_sequence(n):
     if n < 1:
          return "Incorrect input"

     sequence = []
     a, b = 1, 2  # Start from 1, 2 instead of 0, 1
     for _ in range(n):
          sequence.append(a)
          a, b = b, a + b  # Update values
     return sequence
    
def main(): 
     argl = len(sys.argv)
     if argl == 2:
          try:
               n = sys.argv[1]
          except ValueError:
               sys.exit('ERROR: Please enter an integer')
          except TypeError as e:
               sys.exit(f'ERROR: {e}')
          print(', '.join(map(str,fibonacci_sequence(n))))
     else:
          sys.exit('USAGE: python fibonacci.py (n)')
     
if __name__ == '__main__':
     main()