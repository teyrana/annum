import os
from typing import Dict
import uuid

from rich import print as rprint

from .json_row_loader import JSONRowLoader
from .tag_set import TagSet


class TechnologyType:
    _catalog_by_key = {}
    _catalog_by_uuid = {}

    def __init__(self, doc):
        self._description = ''
        self._cost = []
        self._key = 'default-key'
        self._name = 'Default Technology'
        self._requires = []
        self._tags = TagSet()
        self._uuid = uuid.uuid1() # # make a UUID based on the host ID and current time

        if "key" in doc:
            for key, value in doc.items():
                key = key.lower()

                if key.startswith("desc"):
                    self._description = value
                elif key == "key":
                    self._key = value
                elif key in ['id', 'uuid']:
                    self._id = uuid.UUID(value)
                elif key == "name":
                    self._name = value
                elif key.startswith('req'):
                    self._requires += list(value.split(','))
                elif key.startswith('tag'):
                    self._tags.update( value )

                else:
                    raise SyntaxError(f"Unexpected field!: {key} in record: {doc['id']}")

    def __str__(self):
        return f'{self._name}'

    @property
    def description(self):
        return self._description


    @property
    def key(self):
        return self._key

    @property
    def name(self):
        return self._name

    @property
    def requires(self):
        return self._requires

    @property
    def tags(self):
        return self._tags

    @property
    def uuid(self):
        return self._uuid

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

                    instance = TechnologyType(doc)
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
                    rprint(f"[red]XX Could not produce a TechnologyType!:[/red]: {err}")
                    print(f"    :[{line_number}]: '{line}'")
                    return False
 
        if load_count == line_count:
            rprint(f"    [green3]:heavy_check_mark: Loaded all {load_count} records.[/green3]")
            return True
        else:
            load_percent = float(load_count/line_count)*100
            rprint(f"[red]:cross_mark: Loaded {load_count} of {line_count} ({load_percent}%)[/red]")
            return False

