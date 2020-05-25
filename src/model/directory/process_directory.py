#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union

from ..entry import Process

from .data_entry_directory import DataEntryDirectory
from .resource_directory import ResourceDirectory

class ProcessDirectory(DataEntryDirectory):
    
    def __init__(self ):
        super().__init__(Process())

        self._by_input = {}
        self._by_output = {}

    def validate(self, resdir: ResourceDirectory):
        for proc in self._directory.values():

            for resc in proc.input.keys():
                if resc not in self._by_input:
                    self._by_input[resc] = []
                self._by_input[resc].append(proc.name)

                if resc not in resdir:
                    print(f"!! ::Process:{proc._name}: Missing Resource Key: {resc}")

            for resc in proc._output.keys():
                if resc not in self._by_output:
                    self._by_output[resc] = []
                self._by_output[resc].append(proc.name)

                if not resc in resdir:
                    print(f"!! ::Process:{proc._name}: Missing Resource Key: {resc}")

    # # debug
    # def to_yaml(self, _detail):
    #     print(f"## Printing processes, by input resource:")
    #     for k,v in self._by_input.items():
    #         print(f"     [{k}] => {str(v)}")

    #     print(f"## Printing processes, by output resource:")
    #     for k,v in self._by_output.items():
    #         print(f"     [{k}] => {str(v)}")
