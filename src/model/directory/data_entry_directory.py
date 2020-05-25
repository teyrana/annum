#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union


# resource.py
class DataEntryDirectory:
    """
    Define a generic data entry
    
    This handles generic overhead tasks common to all data entry nodes
    """

    def __contains__(self, key: str):
        return key in self._directory

    def __getitem__(self, key: str):
        return self._directory[key]

    def __init__(self, entryTemplate ):
        self._template = entryTemplate

        source_path = os.path.dirname(os.path.realpath(__file__))
        data_dir = "../../../data/"
        filename = entryTemplate.__class__.__name__.lower() + '.json'
        self._data_path = os.path.abspath(os.path.join(source_path, data_dir, filename))

        self._directory = {}
        self._register(entryTemplate)

    def load(self):
        with open(self._data_path, 'r') as source:
            doc = json.load(source)

            if isinstance(doc, list):
                for entry in doc:
                    instance = self._template.new()

                    if "parent" in entry:
                        parent_id = entry["parent"]
                        if parent_id in self._directory:
                            instance.copy(self._directory[parent_id])
                        else:
                            print(f"  ?? Could not find parent entry: {parent_id}")
                        del entry["parent"]

                    instance.load(entry)
                    
                    self._register(instance)

            else:
                print("Syntax Error: File does not contain a list!?")

    def _register(self, entry):
        self._directory[entry.id] = entry

    def to_yaml(self, show_detail: bool = False):
        text = f"    - {self._template.__class__.__name__}:\n"
        for entry in self._directory.values():
            text += entry.to_yaml("        ", show_detail)

        return text

    def validate(self):
        for entry in self._directory.values():
            entry.validate()
