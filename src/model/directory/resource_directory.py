#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union

from ..entry import Resource

from .data_entry_directory import DataEntryDirectory


class ResourceDirectory(DataEntryDirectory):
    
    def __init__(self ):
        super().__init__(Resource())

    def validate(self):
        for entry in self._directory.values():
            entry.validate()
