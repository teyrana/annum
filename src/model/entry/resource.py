#!/usr/bin/python3

import json
import os
from typing import Optional, Union

from .data_entry import DataEntry

class Resource (DataEntry):
    """ defines any Resource"""

    def _load_defaults(self):
        super()._load_defaults()
        
        # Override some Defaults
        self._id = "default-resource"
        self._name = "Default Resource"

        self._units = "kg"

    def _load_field(self, key: str, value: Union[str,int,list,dict] ) -> bool:
        success = super()._load_field(key, value)
        
        if success:
            return True
        else:
            if key == 'units':
                self._units = str(value)
                return True

            return False

    def copy(self, other: "Resource"):
        super().copy(other)

        self._units = other._units


if __name__ == "__main__":
    print("__main__ is not supported")
