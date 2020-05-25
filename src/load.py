#!/usr/bin/python3

from model.directory import *


if __name__ == "__main__":

    print(">> Loading data files...")

    process_directory = ProcessDirectory()
    resource_directory = ResourceDirectory()
    module_directory = ModuleDirectory()
    structure_directory = StructureDirectory()
    unit_directory = UnitDirectory()
    
    
    process_directory.load()
    resource_directory.load()
    module_directory.load()
    structure_directory.load()
    unit_directory.load()


    # In order of increasing complexity
    print("==============")
    resource_directory.validate()
    print("==============")
    process_directory.validate(resource_directory)

    print("==============")
    module_directory.validate()
    print("==============")
    structure_directory.validate()
    print("==============")
    unit_directory.validate()

    # print("==============")
    # print(f"Loading {process_directory.__class__.__name__} Entries:")
    # print(process_directory.to_yaml(True))

    # print("==============")
    # print(f"Loading {process_directory.__class__.__name__} Entries:")
    # print(resource_directory.to_yaml(True))

    # print("==============")
    # print(f"Loading {process_directory.__class__.__name__} Entries:")
    # print(module_directory.to_yaml(True))

    # print("==============")
    # print(f"Loading {process_directory.__class__.__name__} Entries:")
    # print(structure_directory.to_yaml(True))

    # print("==============")
    # print(f"Loading {process_directory.__class__.__name__} Entries:")
    # print(unit_directory.to_yaml(True))

    print("<< Done.")

