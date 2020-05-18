#!/usr/bin/env python

# stdlib imports
import argparse
import os
import pathlib

# 3rd party imports
from rich import print as rprint

# internal imports
from .platform_type import PlatformType
from .process_type import ProcessType
from .resource_type import ResourceType
from .technology_type import TechnologyType
from .unit_type import UnitType
#from .weapon_type import WeaponType

cwd = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
dataPath = os.path.join(cwd, 'data')

def _ingest_directory(from_path: str, prefix: str):
    rprint(f"==>> Loading:    from: [magenta]{from_path}/{prefix}")

    from_path = pathlib.Path(from_path)
    all_paths = [p for p in from_path.iterdir()]
    json_paths = list(filter((lambda p: bool(p.suffix == '.json')), all_paths))

    if prefix:
        load_paths = list(filter((lambda p: p.stem.startswith(prefix)), json_paths))
    else:
        load_paths = json_paths

    success = True
    for each_load_path in load_paths:
        rprint(f"    ==>> Loading file: [magenta]{each_load_path}")
        success &= _ingest_file(each_load_path)
    return success

def _ingest_file(read_path):
    module = os.path.basename(read_path).split('.')[0]

    cls = None
    if 'platforms' == module:
        cls = PlatformType
    elif 'processes' == module:
        cls = ProcessType
    elif 'resources' == module:
        cls = ResourceType
    elif 'technologies' == module:
        cls = TechnologyType
    elif 'units' == module:
        cls = UnitType
    elif 'Weapon' == module:
        #cls = WeaponType
        # NYI
        rprint(f"[red]    :cross_mark: Not-Yet-Implemented.\n")
        return False
    else:
        rprint(f"[red]    :cross_mark: Could not detected file-category: '{module}'  from: {read_path}[/red]")
        return False

    return cls.load(read_path)
    

def ingest(**kwargs):
    read_path = os.path.abspath(kwargs.get('read_path',None))
    prefix = kwargs.get('prefix', '')

    if not os.path.exists(read_path):
        print(f"!!path does not exist?!?: {read_path}")
        return -7

    if os.path.isdir(read_path):
        return _ingest_directory(read_path, prefix)
    else:
        return _ingest_file(read_path)
