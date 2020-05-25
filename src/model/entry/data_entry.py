#!/usr/bin/python3

import json
import os
import re
from typing import Optional, Union


# resource.py
class DataEntry:
    """
    Define a generic data entry
    
    This handles generic overhead tasks common to all data entry nodes
    """

    def __init__(self, source = None):
        if source is None:
            self._load_defaults()
        elif type(self) == type(source):
            print(">> invoked a copy construct; copying from " + source.id)
            self.copy(source)
        elif isinstance(source, dict):
            self.load(source)

    def __str__(self):
        return f"[{self._name}]"

    @property
    def id(self) -> str:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    def load(self, doc: dict):
        if doc is None:
            return
        if "id" in doc:
            self._load_defaults()

            # load this first, to make sure it's available for diagnostics
            self._load_id(doc["id"])
            
            for key, value in doc.items():
                key = key.lower().strip()
                success = self._load_field(key,value)
                if not success:
                    print(f"!! Unexpected field, while loading: {self.__class__.__name__}: {self._id}:   {key} = {value}")


    def _load_defaults(self):
        self._category = []
        self._description = ""
        self._id = "entry-default"
        self._input = {}
        self._name = "Default Data Entry"
        self._output = {}
        self._super = None
        self._technology_level = 0

    def _load_field(self, key: str, value: Union[str,int,list,dict] ) -> bool:
        if key == "cat" or key == "category":
            self._chains = list(value)
            return True
        elif key == "desc" or key == "description":
            self._description = value
            return True
        elif key == "id":
            return True
        elif key == "name":
            self._name = value
            return True
        elif key == "parent":
            return True
        elif key == 'tags':
            self._tags = list(value)
            return True
        elif key == 'tech' or key == 'technology':
            self._technology_level = int(value)
            return True

        return False

    def _load_id(self, new_id: str):
        invalid_characters = re.compile('[^a-zA-Z0-9 _\-\n]')
        self._id = re.sub(invalid_characters, '', new_id.lower())

    def copy(self, other):
        self._category = other._category
        self._description = other._description
        self._id = other._id
        self._input = other._input
        self._name = other._name
        self._output = other._output
        self._technology_level = other._technology_level

        self._parent = other

    def new(self):
        return object.__new__(self.__class__, self)

    def to_yaml(self, indent="", detail=False):
        text = f"{indent}- {self._id}\n"
        if detail:
            text+= f"{indent}    - name: {self._name}\n"
            if self._description:
                text+= f"{indent}    - desc: {self._description}\n"
        return text

    def validate(self) -> bool :
        return True

if __name__ == "__main__":
    print("__main__ is not supported")
