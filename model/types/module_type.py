import json
import os
from typing import Dict

# validate.py
class Module:
    """ defines any Module """

    directory = {}

    def __init__(self, doc):
        self._description = ""
        self._id = "default"
        self._mass = 0.0  # units = grams
        self._name = "Default Module"
        self._super = None
        self._units = ""
        self._weapon = ''

        if doc is None:
            return

        if "id" in doc:
            if "super" in doc:
                superName = str(doc["super"]).lower()
                if superName in Module.directory:
                    self.copy(Module.directory[superName])

            for key, value in doc.items():
                if key == "density":
                    units = str(doc.get("units", ""))
                    density = float(value)
                    self._set_density(units, density)
                elif key == "desc" or key == "description":
                    self._description = value
                elif key == "id":
                    self._id = value
                elif key == "mass":
                    self._mass = float(value)
                elif key == "move":
                    self._movement = Module.Movement.parse(value)
                elif key == "name":
                    self._name = value
                elif key == "super":
                    pass  # already handled, above
                elif key == "weapon":
                    self._weapon = str(value)
                else:
                    raise SyntaxError(f"Unexpected field!: {key}")

    def __str__(self):
        return f"[{self._name}]"

    def copy(self, other):
        self._description = other.description
        self._id = "<copied>"
        self._name = "<copied>"
        self._super = other
        self._mass = other._mass
        self._weapon = other._weapon

    @property
    def description(self):
        return self._description

    @property
    def id(self):
        return self._id

    @property
    def mass(self):
        return self._mass

    @property
    def name(self):
        return self._name

    @property
    def volume(self):
        return self._volume

    @classmethod
    def load(cls, dataPath: str = "") -> Dict:
        baseName = "module.json"
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
                
                try:
                    if isinstance(doc, dict):
                        rsc = Module(doc)
                        Module.directory[rsc._id] = rsc
                except SyntaxError as err:
                    print(f"line: [{lineNumber}] could generate a class!:")
                    print(f"    {line}   ")
                    raise

        return Module.directory


Module.default = Module({})
