from typing import Dict

from .common import TagSet, loadFileInto


class Process:
    """ defines any Process """

    default = None
    directory = {}

    def __init__(self, doc: Dict):
        self._description = ''
        self._id = 'default'
        self._io = {}
        self._name = 'Default Process'
        self._super = None
        self._tags = TagSet()

        if doc is None:
            return

        if 'id' in doc:
            if 'super' in doc:
                superName = str(doc['super']).lower()
                if superName in Process.directory:
                    self.copy(Process.directory[superName])

            for key, value in doc.items():
                if key == 'desc':
                    self._description = value
                elif key == 'id':
                    self._id = value
                elif key == 'io':
                    self._io = value
                elif key == 'name':
                    self._name = value
                elif key == "super":
                    # handled above
                    pass
                elif key == "tag" or key == "tags":
                    self._tags.update(value)
                else:
                    raise SyntaxError(f"Unexpected field!: {key}")

            return

    def __str__(self):
        return f"[{self._name}]"

    def copy(self, other: 'Process'):
        self._description = ''
        self._id = 'copied'
        self._io = other._io
        self._name = 'copied'
        self._super = other
        self._tags = other._tags.copy()

    @property
    def description(self):
        return self._description

    @property
    def id(self):
        return self._id

    @property
    def inputs(self) -> Dict:
        return {resource: quantity for resource, quantity in self._io.items() if quantity < 0.0}

    @property
    def outputs(self) -> Dict:
        return {resource: quantity for resource, quantity in self._io.items() if quantity > 0.0}

    @property
    def name(self):
        return self._name

    @property
    def tags(self):
        return self._tags

    @classmethod
    def load(cls, data_dir: str = '') -> Dict:
        loadFileInto(data_dir, 'processes', cls)
        return cls.directory

    @classmethod
    def validate(cls, resources: Dict) -> bool:
        processNumber = 0
        for eachProcess in Process.directory.values():
            processNumber += 1

            inputs = eachProcess.inputs
            if inputs:
                for eachResourceId in inputs.keys():
                    if eachResourceId not in resources:
                        raise KeyError(f"Process ({eachProcess.id}) is requesting Missing Resource!: {eachResourceId}")

            outputs = eachProcess.outputs
            if outputs:
                for eachResourceId in outputs.keys():
                    if eachResourceId not in resources:
                        raise KeyError(f"Process ({eachProcess.id}) is requesting Missing Resource!: {eachResourceId}")

        return Process.directory


Process.default = Process(None)
