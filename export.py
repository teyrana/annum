#!/usr/bin/env python3

# stdlib imports
import argparse
import os

# # 3rd party imports
import pydot
from rich import print as rprint

# internal imports
from model import Process, Resource, Technology
from model.types import Chassis, Unit, Weapon


def export(**kwargs):
    verbosity = 0
    if 'verbosity' in kwargs:
        verbosity = int(kwargs['verbosity'])

    data_path = '.'
    if 'data_path' in kwargs:
        data_path = kwargs['data_path']

    module = 'resource'
    if 'module' in kwargs and kwargs['module']:
        module = kwargs['module']
    if 'process' == module:
        module == 'resource'

    out_format = kwargs['format'] if 'format' in kwargs else 'dot'

    out_path = '.'
    if 'out_path' in kwargs:
        out_path = kwargs['out_path']

    filter_tag = 0
    if 'tag' in kwargs and kwargs['tag'] is not None:
        filter_tag = str(kwargs['tag'])
    else:
        print("<< Please specify a tag")
        exit(0)

    # ====== Done loading kwargs ======

    rprint("[orange3 ]==== Exporting: ====")
    # print(          f"    :in-path:  {data_path}")
    # print(          f"    :out-path: {out_path}")
    rprint(f"[orange3]    :tag:      {filter_tag}")
    rprint(f"[orange3]    :format:   {out_format}")

    graph = pydot.Dot(filter_tag, graph_type="graph", bgcolor="tan")

    # ====== Start Actual Processing: ======

    if 'resource' == module:
        resources = Resource.load(data_path)
        processes = Process.load(data_path)

        for proc in processes.values():
            if filter_tag in proc.tags.iter():
                if verbosity:
                    print(f"        process matches: {proc.name}")
                for inKey in proc.inputs.keys():
                    for outKey in proc.outputs.keys():
                        if 'time' == inKey:
                            continue
                        inName = resources[inKey].name
                        outName = resources[outKey].name

                        # if verbosity:
                        #     print(f"        :: {inName} => {outName}")

                        graph.add_edge(pydot.Edge(inName, outName))

    elif 'technology'.startswith(module):
        print('NYI')
        exit(-23)

    else:
        rprint(f"[bright_red]:cross_mark: Unrecognized module name!?: {module}[/bright_red]")
        exit(-1)

    # ====== Output Graph ======
    print("==============")
    if 'dot' == out_format:
        graph.write_dot(os.path.join(out_path, f"output.{module}.{filter_tag}.dot"))
    elif 'png' == out_format:
        graph.write_png(os.path.join(out_path, f"output.{module}.{filter_tag}.png"))
    elif 'raw' == out_format:
        graph.write_raw(os.path.join(out_path, f"output.{module}.{filter_tag}.dot"))
    elif 'svg' == out_format:
        graph.write_svg(os.path.join(out_path, f"output.{module}.{filter_tag}.svg"))

    print("<< Wrote output file.")
    print("==============")

    # done
    exit(0)


if "__main__" == __name__:

    parser = argparse.ArgumentParser(description='Verify that data directory is properly formed.')

    parser.add_argument('-m', '--module', dest='module',
                        help='which data-type to output')
    parser.add_argument('-f', '--format', dest='format',
                        help='set the output format')
    parser.add_argument('-t', '--tag', dest='tag',
                        help='filter to a tag')
    parser.add_argument('-v', '--verbose', action='count', dest='verbosity', default=0,
                        help='increase debug level')
    args = parser.parse_args()

    # =================================================================================================================
    cur_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
    data_path = os.path.join(cur_path, 'data')
    out_path = os.path.realpath(os.path.join(cur_path, '..'))

    kwargs = {
        'data_path': data_path,
        'format': args.format,
        'module': args.module,
        'out_path': out_path,
        'verbosity': args.verbosity,
    }

    if args.tag:
        kwargs['tag'] = args.tag

    exit(export(**kwargs))
