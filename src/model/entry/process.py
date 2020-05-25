#!/usr/bin/python3

import json
import os
from typing import Optional, Union

from .data_entry import DataEntry

class Process(DataEntry):
    """ defines any process for convert resources to other resources """

    def _load_defaults(self):
        super()._load_defaults()

        # override some defaults
        self._id = "default-process"
        self._name = "Default Process"

        self._auto = True
        self._input = {}
        self._output = {}

    def _load_field(self, key: str, value: Union[str,int,list,dict] ) -> bool:
        success = super()._load_field( key, value)

        if success: 
            return True
        else:
            if key == "auto" or key == "trigger":
                self._load_trigger(value)
                return True
            elif key.startswith("input"):
                self._input = value
                return True
            elif key.startswith('output'):
                self._output = value
                return True

            return False

    def _load_trigger(self, value: str) -> bool:
        if isinstance(value, str):
            value = value.lower().strip()
            if "1" == value:
                self._auto = True
            elif "true" == value:
                self._auto = True
            elif "auto" == value or "automatic" == value:
                self._auto = True
            else:
                self._auto = False
            return self._auto
        else:
            raise TypeError("Expected a string value for the auto field!")

    @property
    def input(self):
        return self._input

    @property
    def output(self):
        return self._output

    def copy(self, other: "Process"):
        super().copy(other)

        self._input = other._input

        self._output = other._output
        self._auto = other._auto


if __name__ == "__main__":
    print("__main__ is not supported")

