#!/usr/bin/python3


from model import Module, Process, Resource, Structure, Unit
from model import DataEntryDirectory


if __name__ == "__main__":

    print(">> Loading data files...")

    process_directory = DataEntryDirectory(Process())
    resource_directory = DataEntryDirectory(Resource())
    module_directory = DataEntryDirectory(Module())
    structure_directory = DataEntryDirectory(Structure())
    unit_directory = DataEntryDirectory(Unit())
    
    
    process_directory.load()
    resource_directory.load()
    module_directory.load()
    structure_directory.load()
    unit_directory.load()


    print("==============")
    process_directory.validate()
    print("==============")
    resource_directory.validate()
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

