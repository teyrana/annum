import os
from typing import Dict
import uuid

from rich import print as rprint

from .dimensions import Dimensions
from .json_row_loader import JSONRowLoader
from .movement_type import MovementType
from .tag_set import TagSet


class WeaponType:
    _catalog_by_key = {}
    _catalog_by_uuid = {}

    def __init__(self, doc):
        self._description = ""
        self._id = "default"
        self._mass = 1000.0
        self._name = "Default Weapon"
        self._tags = []
        self._uuid = uuid.uuid1()

        if "key" in doc:
            for key, value in doc.items():
                if key == "desc" or key == "description":
                    self._description = value
                elif key == "id":
                    self._id = value
                elif key == "mass":
                    self._mass = float(value)
                elif key == "name":
                    self._name = value
                elif key == "uuid":
                    self._uuid = uuid.UUID(value)
                elif key == "volume":
                    self._volume = float(value)
                else:
                    raise SyntaxError(f"Unexpected field!: {key}")

    def __str__(self):
        return f"[{self._name}]"

    @property
    def description(self):
        return self._description

    @property
    def key(self):
        return self._key

    @property
    def mass(self):
        return self._mass

    @property
    def name(self):
        return self._name

    @property
    def tags(self):
        return self._tags

    @property
    def uuid(self):
        return self._uuid

    @property
    def volume(self):
        return self._volume

    @classmethod
    def load(cls, dataPath: str = "") -> Dict:
        baseName = "weapons.json"
        filename = os.path.join(dataPath, baseName)

        print(f"Loading file: {filename}")

        with open(filename, "r") as source:
            lineNumber = 0
            for line in source:
                lineNumber += 1

                if line.startswith("//") or line.startswith("#"):
                    continue
                elif not line.strip("\n \t"):
                    continue

                try:
                    doc = json.loads(line)
                except json.decoder.JSONDecodeError as err:
                    print(f"line: [{lineNumber}] could not be read!:")
                    print(f"    {line}   ")
                    raise

                if isinstance(doc, dict):
                    rsc = Weapon(doc)
                    Weapon.directory[rsc._id] = rsc

        return Weapon.directory


Weapon.default = Weapon({})
