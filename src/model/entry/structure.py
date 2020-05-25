#!/usr/bin/python3

import json
import os
from typing import Optional, Union

from .data_entry import DataEntry

class Structure(DataEntry):
    """ defines a stationary structure, when player owned, or not"""

    def _load_defaults(self):
        super()._load_defaults()

        # override some defaults:
        self._id = "default-structure"
        self._name = "Default Structure"
        
        self._cost = {}
        
        self._footprint = (1,1)
        self._extends_territory = False

        self._garrison = 0
        self._armor = None  # NYI
        self._health = 100

        # defines modules that can be removed OR added
        self._buildable_modules = []
        # modules included when built
        # -- any modules NOT in '_allowed_modules', may not be added or removed 
        self._included_modules = []
        self._module_slot_count = 1

        self._storage = []

    def _load_field(self, key: str, value: Union[str,int,list,dict]) -> bool:
        success = super()._load_field(key, value)
        
        if success:
            return True

        else:
            if key == "buildable": 
                self._buildable_modules = value
                return True
            elif key == "cost":
                self._cost = value
                return True
            elif key == "footprint":
                self._footprint = tuple(value)
                return True
            elif key == "garrison":
                self._garrison = int(value)
                return True
            elif key == "included":
                self._included_modules = value
                return True
            elif key == "slots":
                self._module_slot_count = int(value)
                return True
            elif key == "storage":
                self._storage = list(value)
                return True

            return False

    def copy(self, other):
        super().copy(other)

        self._armor = other._armor
        self._buildable_modules = other._buildable_modules
        
        self._cost = other._cost
        
        self._extends_territory = other._extends_territory
        self._footprint = other._footprint
        self._garrison = other._garrison
        self._health = other._health
        
        self._included_modules = other._included_modules
        
        self._module_slot_count = other._module_slot_count
        
        self._storage = other._storage


if __name__ == "__main__":
    print("__main__ is not supported")
