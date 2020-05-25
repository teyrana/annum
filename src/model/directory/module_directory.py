#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union

from ..entry import Module

from .data_entry_directory import DataEntryDirectory
from .process_directory import ProcessDirectory
from .resource_directory import ResourceDirectory


class ModuleDirectory(DataEntryDirectory):
    
    def __init__(self ):
        super().__init__(Module())

        self._by_cost = {}
        self._by_process = {}

    def validate(self, proc_dir: ProcessDirectory, resc_dir: ResourceDirectory):
        for modl in self._directory.values():
            for resc in modl.cost:
                if resc not in self._by_cost:
                    self._by_cost[resc] = []
                self._by_cost[resc].append(modl.name)

                if resc not in resc_dir:
                    print(f"!! ::Module:{modl._name}: Could not find Resource: {resc}")

            for proc in modl.processes:
                if proc not in self._by_process:
                    self._by_process[proc] = []
                self._by_process[proc].append(modl.name)

                if proc not in proc_dir:
                    print(f"!! ::Module:{modl._name}: Could not find Process: {proc}")

    # debug
    def to_yaml(self, _detail):
        print(f"## Showing Modules, by Resource Cost:")
        for k,v in self._by_cost.items():
            print(f"     [{k}] => {str(v)}")

        print(f"## Showing Modules, by process:")
        for k,v in self._by_process.items():
            print(f"     [{k}] => {str(v)}")