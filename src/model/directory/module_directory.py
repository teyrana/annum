#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union

from ..entry import Module

from .data_entry_directory import DataEntryDirectory
from .process_directory import ProcessDirectory

class ModuleDirectory(DataEntryDirectory):
    
    def __init__(self ):
        super().__init__(Module())

    # def validate(self, rdir: ProcessDirectory):
    #     # for entry in self._directory.values():
    #     #     entry.validate(rdir)
    #     pass
