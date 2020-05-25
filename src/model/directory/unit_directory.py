#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union

from ..entry import Unit

from .data_entry_directory import DataEntryDirectory
from .process_directory import ProcessDirectory

class UnitDirectory(DataEntryDirectory):
    
    def __init__(self ):
        super().__init__(Unit())

    # def validate(self, rdir: ProcessDirectory):
    #     # for entry in self._directory.values():
    #     #     entry.validate(rdir)
    #     pass
