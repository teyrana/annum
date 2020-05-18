
class TagSet:

    def __init__(self, tags=None):
        self._tags = set()
        self.update(tags)

    def iter(self):
        return self._tags

    def __str__(self):
        return ','.join(list(self._tags))

    def update(self, tags):
        if isinstance(tags, str):
            self._tags.update(tags.split(','))
        elif isinstance(tags, list):
            self._tags.update(tags)
        elif isinstance(tags, type(self)):
            # because we implement the iterable interface on this class
            self._tags.update(tags._tags)
        return self

    def copy(self):
        return TagSet(self)
