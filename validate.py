#!/usr/bin/env python

# stdlib imports
import argparse
import os
import pathlib

# 3rd party imports
from rich import print as rprint

# internal imports
import model.ingest
#from model import Process, Resource, Technology
#from model.types import Chassis, Unit, Weapon

if "__main__" == __name__:
    parser = argparse.ArgumentParser(description='Verify that data directory is properly formed.')

    parser.add_argument('-i', '--input_file', default='',
                        help='load data from this file')
    parser.add_argument('-p', '--prefix', default='',
                        help='only validate files with this prefix')
    parser.add_argument('-t', '--tag', dest='tag', default='',
                        help='filter to a tag (not yet implemented)')

    args = parser.parse_args()

    # =================================================================================================================
    current_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
    data_path = os.path.join(current_path, 'data')
    read_path = args.input_file or data_path
    prefix = args.prefix
    tag = args.tag

    success = model.ingest(read_path=read_path, prefix=prefix, tag=tag)

    exit(0 if success else -4)
