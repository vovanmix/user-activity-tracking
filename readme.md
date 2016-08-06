#Data store format
- One record line represents user stats for a day, {user id: [sessions per day, last session id]}
- It occupies around 40 bytes
- Avg log size per day: 40mb (utf-8)
- Avg log size per month: 1.2gb
- Total log size for 5 years: 72gb
##Option 1: 1 file per month
- Files to read to get stats for 5 years: 60
- Avg size of one file: 1.2gb
```
// file 2016-01.json
[
    {
        "23432438768": [2, "2345-43534-534543"],
        "23432432099": [5, "234refwe-243232re"]
    },
    {
        23432438768: [4, "23432432-32432-423"],
        23432432099: [1, "2342332432-234234"],
        23654577222: [1, "23werwr25w453ferfds"]
    }
]
```
#Option 2: 1 file per day
- Files to read to get stats for 5 years: 1800
- Avg size of one file: 40mb
```
// file 2016-01-20.json
{
    23432438768: [4, "23432432-32432-423"],
    23432432099: [1, "2342332432-234234"],
    23654577222: [1, "23werwr25w453ferfds"]
}
```
#Summary
Option 2 is better because if we have to read the whole month's file to write a new data, it will occupy 1.2gb per process, and the server will quickly run out of memory.
Also, using option 2 we will be able to run multiple (around 25) parallel asynchronous file read tasks when we will prepare stats.