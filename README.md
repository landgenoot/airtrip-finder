# Ryanair airtrip finder
Travelling across multiple cities in Europe at minimal costs.
Note: Needs some further parameters to become usable. E.g. multi-day support, maximum flights per day, and minimum transit time.


## Example usage
```
$ node airtrip.js 
Lets find an airtrip!
prompt: Target departure date (DD-MM-YYYY):  (2016-02-01) 2016-03-15
prompt: Budget in EUR:  (50) 150
prompt: Departure/arrival airports (e.g. EIN, AMS, MST):  (EIN) EIN, AMS, MST

--- € 38.98, 1429.982 km, EUR/KM 0.027259084380083103
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 59.980000000000004, 1573.493 km, EUR/KM 0.03811901292220557
Amsterdam 11:00 - Dublin 11:40
Dublin 12:45 - Eindhoven 15:25

--- € 33.65, 1635.268 km, EUR/KM 0.020577666780001808
Eindhoven 17:25 - Venice (TSF) 19:00
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 81.98, 3611.654 km, EUR/KM 0.022698741352300083
Eindhoven 09:25 - Lisbon 11:15
Lisbon 11:40 - Eindhoven 15:30

--- € 46.98, 1641.402 km, EUR/KM 0.0286218732522563
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25

--- € 39.25678199785064, 717.562 km, EUR/KM 0.05470855758505974
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50

--- € 98.96, 3003.475 km, EUR/KM 0.032948501319305136
Amsterdam 11:00 - Dublin 11:40
Dublin 12:45 - Eindhoven 15:25
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 93.63, 3208.761 km, EUR/KM 0.02917948703565021
Amsterdam 11:00 - Dublin 11:40
Dublin 12:45 - Eindhoven 15:25
Eindhoven 17:25 - Venice (TSF) 19:00
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 90.19999999999999, 3023.126 km, EUR/KM 0.029836665755909604
Eindhoven 10:25 - Barcelona (GRO) 12:25
Barcelona (GRO) 13:20 - Alghero 14:35
Alghero 16:00 - Venice (TSF) 17:20
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 120.96, 5041.636 km, EUR/KM 0.023992212051802228
Eindhoven 09:25 - Lisbon 11:15
Lisbon 11:40 - Eindhoven 15:30
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 115.63, 5246.922 km, EUR/KM 0.022037682283060432
Eindhoven 09:25 - Lisbon 11:15
Lisbon 11:40 - Eindhoven 15:30
Eindhoven 17:25 - Venice (TSF) 19:00
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 80.63, 3276.67 km, EUR/KM 0.02460729948392728
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25
Eindhoven 17:25 - Venice (TSF) 19:00
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 85.96, 3071.384 km, EUR/KM 0.027987382886672584
Eindhoven 11:30 - Dublin 12:20
Dublin 12:45 - Eindhoven 15:25
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 75.90678199785063, 2841.518 km, EUR/KM 0.02671346160673648
Eindhoven 08:00 - London (STN) 08:15
London (STN) 10:35 - Berlin (SXF) 13:25
Berlin (SXF) 14:45 - Venice (TSF) 16:20
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 78.23678199785064, 2147.544 km, EUR/KM 0.03643081678319543
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 18:55 - Turin 20:25
Turin 20:50 - Eindhoven 22:20

--- € 72.90678199785063, 2352.83 km, EUR/KM 0.030986846477582583
Eindhoven 08:00 - London (STN) 08:15
London (STN) 12:40 - Eindhoven 14:50
Eindhoven 17:25 - Venice (TSF) 19:00
Venice (TSF) 20:15 - Eindhoven 21:50

--- € 87.53910975998784, 4778.484 km, EUR/KM 0.01831943138451187
Eindhoven 08:00 - London (STN) 08:15
London (STN) 08:55 - Warsaw (WMI) 12:10
Warsaw (WMI) 13:00 - Paris (BVA) 15:30
Paris (BVA) 16:50 - Venice (TSF) 18:25
Venice (TSF) 20:15 - Eindhoven 21:50


```
