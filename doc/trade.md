# Trade / Depots

## Applicable Buildings

- Trade Depot
- Logistics Depot
- Oil Depot

## Design Intent
Allow graceful blending of simplified resourcing vs full tech-tree resourcing

## Trading
- requires access to a Depot
- Depot requires access to the external world (i.e. the map edge)
    - Direct (no convoy needed, transactions are instant)
    - Trains Convoy 
    - Boats Convoy
    - Truck Convoy

## Features
- Allow the bulk, automatic trading of resources for credits
- Configurable selling:
    - "Trade All"
        - trade all resources for a set price ('simple resourcing')
    - "Trade Excess"
        - trade all resources *in excess* of some quantity will be sold
        - quantity is user-configurable
        - resources less than quantity will be untouched, and allowed to replenish
    - "Trade X"
        - Every Convoy contains 'x qty' of the resource"
        - predictable revenue
        - local production chains may suffer


