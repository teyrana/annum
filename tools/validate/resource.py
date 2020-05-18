#!/usr/bin/python3

import json
import os


# resource.py
class Resource:
    """ defines any Resource"""

    directory = {
        "default": {
            "_chains": None,
            "_description": None,
            "_id": None,
            "_name": None,
            "_super": None,
            "_tier": 0,
            "_units": "kg"
        }
    }

    def __init__(self, doc):
        self.copy(Resource.directory["default"])

        if "id" in doc:
            if doc["id"] == "default":
                return
            else:
                for key, value in doc.items():
                    if key == "chains":
                        self._chains = list(value)
                    elif key == "desc" or key == "description":
                        self._description = value
                    elif key == "id":
                        self._id = value
                    elif key == "name":
                        self._name = value
                    elif key == "category" or key == "super":
                        superName = str(value).lower()
                        if superName in Resource.directory:
                            self.copy(Resource.directory[superName])
                    elif key == "tags":
                        self._tags = list(value)
                    elif key == "tier":
                        self._tier = int(value)
                    elif key == "units":
                        self._units = value
                    else:
                        raise SyntaxError(f"Unexpected field!: {key}")

                Resource.directory[self._name] = self

    def __str__(self):
        return f"[{self._name}]"

    def copy(self, other):
        for key, value in other.items():
            self.__setattr__(key, value)
        self._super = other


if __name__ == "__main__":
    source_path = os.path.dirname(os.path.realpath(__file__))
    filename = os.path.abspath(source_path + "../../../data/resources.json")

    print(f"Validating file: {filename}")
    print("==============")

    with open(filename, 'r') as source:
        doc = json.load(source)

        tier_number = 0
        if isinstance(doc, dict) and isinstance(doc['resources'], list):
            all_tiers = doc['resources']
            for each_tier in all_tiers:
                print(f"    Tier [{tier_number}]")
                for resource in each_tier:
                    r = Resource(resource)
                    print("        " + str(r))

                tier_number += 1
        else:
            print("Syntax Error: File does not start with an object!?")

    print("==============")
    print(f"Loaded {len(Resource.directory)} Resources.")

    # done
    exit(0)
