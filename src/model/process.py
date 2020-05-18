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
                self._auto = True 
                # self._trigger = self._load_trigger(value)
                return True
            elif key == "input":
                self._input = value
                return True
            elif key == 'output':
                self._output = value
                return True

            return False

    def copy(self, other: "Process"):
        super().copy(other)

        self._input = other._input

        self._output = other._output
        self._auto = other._auto


if __name__ == "__main__":
    print("__main__ is not supported")

