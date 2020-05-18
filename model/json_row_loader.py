import json
import os

class JSONRowLoader:

    def __enter__(self):
        return self

    def __init__(self, from_path: str):
        if not os.path.exists(from_path):
            return -11
        if not os.path.isfile(from_path):
            return -12

        self._source_stream = open(from_path, 'r')
        self._line_number = 0
        self._total_row_count = 0
        self._valid_row_count = 0

    def __iter__(self):
        return self

    def __next__(self):
        for line in self._source_stream:
            self._line_number += 1

            if line.startswith('//') or line.startswith('#'):
                # skip comment lines
                continue
            
            elif '' == line.strip('\n \t'):
                # skip empty lines
                continue
                
            self._total_row_count += 1
            try:
                doc = json.loads(line)
                self._valid_row_count += 1

                # exit out of loop
                return (doc, self._line_number, line)
                
            except json.decoder.JSONDecodeError:
                print(f"line: [{self._line_number}] could not be read!:")
                print(f'    {line}   ')
                raise
        return (None, self._line_number, '')


    def __exit__(self, type, value, traceback):
        if type is None:
            return True
        else:
            # this causes the exception to be re-raised
            return False
            


