# Ryanair airtrip finder
Travelling across multiple cities in Europe at minimal costs


## Example usage
```
$ node airtrip.js 
Lets find an airtrip!
prompt: Target departure date (DD-MM-YYYY):  (2016-02-01) 2016-03-03
prompt: Budget in EUR:  (50) 150
prompt: Departure/arrival airports (e.g. EIN, AMS, MST):  (EIN) EIN, AMS, MST

--- € 25.73, 1429.982 km
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 44.98, 1635.268 km
Eindhoven 14:55 - Venice (TSF) 16:30
Venice (TSF) 16:55 - Eindhoven 18:30

--- € 57.980000000000004, 2797.58 km
Eindhoven 16:35 - Madrid 19:00
Madrid 19:35 - Eindhoven 21:55

--- € 46.59, 3080.172 km
Eindhoven 16:40 - Brindisi 19:10
Brindisi 19:35 - Eindhoven 22:15

--- € 33.98, 717.562 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50

--- € 97.98, 3611.654 km
Eindhoven 09:25 - Lisbon 11:15
Lisbon 11:40 - Eindhoven 15:30

--- € 46.98, 1641.402 km
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25

--- € 59.07, 3082.819 km
Eindhoven 14:55 - Venice (TSF) 16:30
Venice (TSF) 17:35 - Brindisi 19:05
Brindisi 19:35 - Eindhoven 22:15

--- € 64.97, 2293.824 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 13:10 - Venice (TSF) 16:10
Venice (TSF) 16:55 - Eindhoven 18:30

--- € 74.97, 3056.876 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 08:35 - Madrid 12:05
Madrid 19:35 - Eindhoven 21:55

--- € 70.71, 3065.25 km
Eindhoven 14:55 - Venice (TSF) 16:30
Venice (TSF) 16:55 - Eindhoven 18:30
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 59.71, 2147.544 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 80.57, 3797.734 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 16:40 - Brindisi 19:10
Brindisi 19:35 - Eindhoven 22:15

--- € 91.96000000000001, 3515.142 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 16:35 - Madrid 19:00
Madrid 19:35 - Eindhoven 21:55

--- € 78.96, 2352.83 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 14:55 - Venice (TSF) 16:30
Venice (TSF) 16:55 - Eindhoven 18:30

--- € 79.06, 3741.375 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 13:10 - Venice (TSF) 16:10
Venice (TSF) 17:35 - Brindisi 19:05
Brindisi 19:35 - Eindhoven 22:15

--- € 123.71, 5041.636 km
Eindhoven 09:25 - Lisbon 11:15
Lisbon 11:40 - Eindhoven 15:30
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 144.57, 6691.826 km
Eindhoven 09:25 - Lisbon 11:15
Lisbon 11:40 - Eindhoven 15:30
Eindhoven 16:40 - Brindisi 19:10
Brindisi 19:35 - Eindhoven 22:15

--- € 72.71, 3071.384 km
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 93.57, 4721.574 km
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25
Eindhoven 16:40 - Brindisi 19:10
Brindisi 19:35 - Eindhoven 22:15

--- € 104.96000000000001, 4438.982 km
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25
Eindhoven 16:35 - Madrid 19:00
Madrid 19:35 - Eindhoven 21:55

--- € 93.05000000000001, 3800.381 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 14:55 - Venice (TSF) 16:30
Venice (TSF) 17:35 - Brindisi 19:05
Brindisi 19:35 - Eindhoven 22:15

--- € 90.69999999999999, 3723.806 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 13:10 - Venice (TSF) 16:10
Venice (TSF) 16:55 - Eindhoven 18:30
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 104.68999999999998, 3782.812 km
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 14:55 - Venice (TSF) 16:30
Venice (TSF) 16:55 - Eindhoven 18:30
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

```
