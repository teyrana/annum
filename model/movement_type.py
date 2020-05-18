import enum

class MovementType(enum.Enum):
    UNKNOWN = (0, '?', 'Unknown')
    STATIC = (1, 'S', 'Static')
    INFANTRY = (2, 'I', 'Infantry (2 Legs)')
    WHEELED = (3, 'W', 'Wheeled Vehicles')
    TRACKED = (4, 'T', 'Tank Treads')
    MECH = (5, 'M', 'Mechanized Walker')        # similiar to 'infantry' but heavier
    HELICOPTER = (6, 'H', 'Helicopter')
    AIRPLANE = (7, 'A', 'Airplane')
    BOAT = (8, 'R', 'Riverine Surface Vessel')  # shallow draft, land at beaches
    SHIP = (9, 'O', 'Water Surface Vessel')     # deep draft, requires port facilities
    SUBMARINE = (10,'U', 'Submarine')
    
    def __new__(cls, value, code, desc):
        obj = object.__new__(cls)
        obj._value_ = value
        obj.code = code
        obj.description = desc
        return obj
    
    @classmethod
    def parse(cls, text):
        text = text.strip().upper()
        
        if 1 == len(text):
            for mt in MovementType:
                if text == mt.code:
                    return mt
        else:
            for mt in MovementType:
                if mt.name.startswith(text):
                    return mt

