## Logistics:

Each Supply Node has its own supply pool creates a network.
        Within that network, supply trips are free.
        Supply quantities are individual to each... node?
    roads are required to connect each node

Trade Route:
    Each stop/node has an load quantity (LQT) 'N'
    May have 'M' transports associated with it.
    load qty is associated with a specific trade route
    positive LQT
        transfer from node to transport
        will transfer until transport has 'N' onboard
    negative LQT
        will transfer from ship to node
        will transfer until Node has 'N'


Simcity-Like Zoning
   "Fluid fields"
       Allocation:
           by single tile basis
           fields may be 'painted' in
           auto-laydown

       utitilization
           X tiles are required for 100% utilization
           any tile within y distance is available
           a tile may only be worked once


Resource Throttling:
    Ability to limit automatic consumption
        by resource units / minute
        by citizens of a given tier
		
Maintenance Cost
	ammo cost
	movement
	base maintenance
automated construction
	scouts
	fighter screen
	ammo
		missiles
		shells
	


planetary complex: 
  maintenance cost
    ammo cost
    movement
    base maint.
  automated construction
    scouts
    ammo (missiles/shells/bullets)
    drones
    laser "ammo"
building yard components
  gantry / framing
  work shed (module)
  overhead crane (H frame)
  storage yard / tanks
  aux power generator

vacuum yard (ship?)
  spine
  mooring rib
  storage tank
  storage depot ( bin/box/cylinder)
  manufacturing bubble (module)
  engine
  fuel
  manuever sys
  bridge / command center
  docking yard  - large freighter
  docking - shuttle
  docing tube / gantry
  cabin / dorm
  tug (construction tug) 
  construction mote


# Building Configuration 
    - Buildings
        - contain n modules
            - contain n processes

## Sample Building configurations:
- power_plant (simple):
    - power_generation_unit:
        - generate_electrocityt_from_wood

    - power_plant (complex):
        - furnace:
            - burn_wood
            - burn_coal
            - burn_coal
        - steam_boiler:
            - generate_steam
        - steam_turbine
            - drive_turbine
        - spin_generator
            - generate_electricity

    - farm:
        - dirt:
            - grow_wheat
            - grow_vegetables
        - fertilizer
            
    - algae_farm:
        - algae_reactor:
             - synthesize_gasol

