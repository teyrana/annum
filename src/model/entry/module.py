#!/usr/bin/python3

import json
import os
from typing import Optional, Union

from .data_entry import DataEntry

class Module(DataEntry):
    """ defines any Module"""

    def _load_defaults(self):
        super()._load_defaults()

        # Override some Defaults
        self._id = "default-module"
        self._name = "Default Module"

        self._cost = {}
        self._processes = []

    def _load_field(self, key: str, value: Union[str,int,list,dict] ) -> bool:
        success = super()._load_field(key, value)
        
        if success:
            return True
            
        else:
            if key == "cost":
                self._cost = value
                return True
            elif key == "processes":
                self._processes = value
                return True
            
            return False

    @property
    def cost(self):
        return self._cost

    @property
    def processes(self):
        return self._processes

    def copy(self, other):
        super().copy(other)
        
        self._cost = other._cost
        self._processes = other._processes

if __name__ == "__main__":
    print("__main__ is not supported")
