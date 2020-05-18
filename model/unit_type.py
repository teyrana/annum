from enum import Enum
import os
from typing import Dict
import uuid

from rich import print as rprint

from .json_row_loader import JSONRowLoader
from .sensor_type import SensorType
from .tag_set import TagSet

class UnitType:
    _catalog_by_key = {}
    _catalog_by_uuid = {}

    def __init__(self, doc):
        self._ammo = []
        self._chassis = ''
        self._description = ""
        self._key = 'default'
        self._mass = 0.0  # units = grams
        self._name = "Default Unit"
        self._sensor = SensorType.VISUAL
        self._super = None
        self._weapon = None
        self._uuid = uuid.uuid1()

        if "key" in doc:
            for key, value in doc.items():
                if key == 'ammo':
                    self._ammo += value
                elif 'platform'.startswith(key):
                    self._chassis = value
                elif key.startswith('desc'):
                    self._description = value
                elif key == 'key':
                    self._key = value
                elif key in ['id', 'uuid']:
                    self._uuid = uuid.UUID(value)
                elif key == "mass":
                    self._mass = float(value)
                elif key == "module":
                    pass  # NYI
                    #self._mass = float(value)
                elif key == 'name':
                    self._name = value
                elif key.startswith('sens'):
                    self._sensor = SensorType.parse(value)
                elif key == "weapon":
                    self._weapon = str(value)
                else:
                    raise SyntaxError(f"Unexpected field!: {key}")

    def __str__(self):
        return self._name

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
    def mobility(self):
        return self._chassis.movement.abbrev

    @property
    def name(self):
        return self._name

    @property
    def sensor(self):
        return self._sensor.abbrev

    @property
    def uuid(self):
        return self._uuid

    @property
    def volume(self):
        return self._volume

    @classmethod
    def load(cls, from_path: str) -> bool:
        with JSONRowLoader(from_path) as loader:
            line_count = 0
            load_count = 0
            for row in loader:
                doc, line_number, line = row
                if None is doc:
                    break

                line_count += 1

                try:
                    key = doc.get('key', None).strip().lower()
                    if None is key:
                        rprint(f"[red]XX row is missing a key!![/red]")
                        print(f"    :{line_number}: {line}")
                        return False
                    elif key in cls._catalog_by_key:
                        rprint(f"[red]XX Row is a duplicate key!")
                        print(f"    :[{key}]: {cls._catalog[key].line_number} <=!!=> {line_number}")
                        return False

                    instance = UnitType(doc)
                    load_count += 1

                    instance.line_number = line_number
                    cls._catalog_by_key[instance._key] = instance
                    assert(instance.uuid not in cls._catalog_by_uuid)
                    cls._catalog_by_uuid[instance._uuid] = instance

                except KeyError as err:
                    rprint(f"[red]XX KeyError: {err}")
                    print(f"    :[{line_number}]: '{line}'")
                    return False
                except SyntaxError as err:
                    rprint(f"[red]XX Could not produce a UnitType!:[/red]: {err}")
                    print(f"    :[{line_number}]: '{line}'")
                    return False
 
        if load_count == line_count:
            rprint(f"    [green3]:heavy_check_mark: Loaded all {load_count} records.[/green3]")
            return True
        else:
            load_percent = float(load_count/line_count)*100
            rprint(f"[red]:cross_mark: Loaded {load_count} of {line_count} ({load_percent}%)[/red]")
            return False



