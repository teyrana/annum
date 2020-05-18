import enum

class SensorType(enum.Enum):
    UNKNOWN = (0, 'U', '')
    VISUAL = (1, 'V', 'default')
    INFRARED = (2, 'I', 'Includes Night Vision')
    AIRBORNE = (3, 'A', 'can see over walls cliffs, and other terrain')
    RADAR = (4, 'R', 'Can see through Fog, Rain, Dust, etc')
    ELECTRONIC = (5, 'E', 'detects any sort of electronic emmisions, like radio, cell phones, RADAR, etc')
    
    def __new__(cls, id, abbrev, desc):
        obj = object.__new__(cls)
        obj._value_ = id
        obj.id = id
        obj.abbrev = abbrev
        obj.description = desc
        return obj
    
    @classmethod
    def parse(cls, text):
        text = text.strip().lower()
        if 'eye' == text:
            return cls.VISUAL
        elif 'ir' == text:
            return cls.INFRARED
        elif 'air' == text:
            return cls.AIRBORNE
        elif 'radar' == text:
            return cls.RADAR
        elif 'ew' == text:
            return cls.ELECTRONIC
        else:
            return cls.UNKNOWN

