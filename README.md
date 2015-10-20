# histograph-tests

Integration tests for Histograph API + Histograph Data. histograph-tests runs a set of API calls, and compares the GeoJSON output of each call to the expected results specified in [`tests.yml`](tests.yml).

## Data

histograph-tests expects a running Histograph API with Histograph data from the following two sources:

- [https://github.com/histograph/data](https://github.com/histograph/data)
- [https://github.com/erfgoed-en-locatie/data](https://github.com/erfgoed-en-locatie/data)

## Usage

    npm install
    npm test

histograph-tests uses the API endpoint specified in your local [Histograph configuration file](https://github.com/histograph/config#histograph-config).

## Tests

Specify your tests in [`tests.yml`](tests.yml), in the following format:

```yml
- query:
    q: mosbeekweg                    # Query parameters
    type: hg:Street                  # (see https://github.com/histograph/api)
  concepts:                          # Array of expected concepts
    - pits:                          # Array of expected PITs inside single concept
      - id: nwb/hezingen-mosbeekweg  # Expected key/values inside single PIT
        dataset: nwb
        data:
          gme_naam: Tubbergen
```

Copyright (C) 2015 [Waag Society](http://waag.org).
