# paired-comparison

## comparison algorithm
```python

array = [0,1,2,3,4]
"""
a=0 b[a+1:n]
0-1
0-2
0-3
0-4
a=1 b[a+1:n]
1-2
1-3
1-4
a=2 b[a+1:n]
2-3
2-4
a=3 b[a+1:n]
3-4
"""
def paired_comparison(array):
    results = dict.fromkeys(array, 0)
    for a, chA in enumerate(array[:-1]):
        for b, chB in enumerate(array[a+1:]):
            print(f'Comparing:  a={chA}  b={chB}')
            ans = chA || chB
            results[ans] += 1
    return results
```
