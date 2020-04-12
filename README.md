# paired-comparison

## comparison algorithm
```python

array = [0,1,2,3,4]

def paired_comparison(array):
    results = dict.fromkeys(array, 0)
    for a, chA in enumerate(array[:-1]):
        for b, chB in enumerate(array[a+1:]):
            print(f'Comparing:  a={chA}  b={chB}')
            ans = chA | chB
            results[ans] += 1
    return results
```
