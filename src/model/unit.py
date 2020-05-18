#!/usr/bin/python3

import json
import os
from typing import Optional, Union

from .data_entry import DataEntry

class Unit(DataEntry):
    """ defines a stationary structure, when player owned, or not

    structure_type
    name_str
    desc_str
    hitpoints_u
    armor_frac

    tag_list

    # modules
 
     module_volume_capacity
    module_volume_available

    """

    def _load_defaults(self):
        super()._load_defaults()
        
        # Override some Defaults
        self._id = "default-unit"
        self._name = "Default Unit"

        self._armor = 0
        self._cost = {}
        self._health = 100

        # self._module_slot_count = other._module_slot_count

    def _load_field(self, key: str, value: Union[str,int,list,dict] ) -> bool:
        success = super()._load_field(key, value)
        
        if success:
            return True
        else:
            if key == "armor":
                self._armor = int(value)
                return True
            elif key == "cost":
                self._cost = value
                return True
            elif key == "health":
                self._health = int(value)
                return True
            return False

    def copy(self, other: "Structure"):
        super().copy(other)

        self._armor = other._armor
        self._cost = other._cost
        self._health = other._health

        # self._module_slot_count = other._module_slot_count


if __name__ == "__main__":
    print("__main__ is not supported")
