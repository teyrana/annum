#!/usr/bin/python3

from enum import Enum
import bitarray
import json
import os
from typing import Optional, Union

from .data_entry import DataEntry

class Resource (DataEntry):
    """ defines any Resource"""

    # this are bit flags, which may be combined
    #     if set, => bulk type resource, like sand
    #     if cleared => countable resource, like boxes
    ALIVE = 1
    PORTABLE = 2
    EDIBLE = 4
    GAS = 8
    LIQUID = 16
    HAZMAT = 32
    UNITARY = 64

    DEFAULT_FLAGS = PORTABLE | UNITARY
    PERSON_FLAGS = UNITARY | ALIVE

    @staticmethod
    def _load_storage(storage):
        if isinstance(storage, str): 
            storage = str(storage).lower().strip()
            if "bulk" == storage:
                return Resource.PORTABLE
            elif "carry" == storage:
                return Resource.PORTABLE
            elif "food" == storage:
                return Resource.PORTABLE | Resource.EDIBLE
            elif "liquid" == storage:
                return Resource.LIQUID
            elif "gas" == storage:
                return Resource.GAS
            elif "hazmat" == storage:
                return Resource.HAZMAT
            elif "other" == storage or "special" == storage:
                return 0
            elif "person" == storage:
                return Resource.PERSON_FLAGS
            elif "unit" == storage:
                return Resource.UNITARY
        
        elif isinstance(storage, int):
            return storage

        elif isinstance(storage, list):
            raise NotImplementedError("NYI")

        else:
            raise TypeError(f"Type: {type(storage)} not recognized for 'storage' field")

    def _load_defaults(self):
        super()._load_defaults()
        
        # Override some Defaults
        self._id = "default-resource"
        self._name = "Default Resource"

        self._units = "kg"
        self._storage = Resource.DEFAULT_FLAGS

    def _load_field(self, key: str, value: Union[str,int,list,dict] ) -> bool:
        success = super()._load_field(key, value)
        
        if success:
            return True
        else:
            if key == 'storage':
                self._storage = self._load_storage(value)
                return True
            elif key == 'units':
                self._units = str(value)
                return True

            return False


    def copy(self, other: "Resource"):
        super().copy(other)

        self._units = other._units
        self._storage = other._storage


if __name__ == "__main__":
    print("__main__ is not supported")
