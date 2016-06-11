import os
from os import path
from glob import glob
import re
import runpy
import inspect
import textwrap
import ast
from flexx.pyscript import py2js

wrap_code = """(function(){
%s
})()"""


def get_function_call_dependency(filename):
    with open(filename) as f:
        root = ast.parse(f.read())

    calls = {}
    
    for node in root.body:
        if isinstance(node, ast.FunctionDef):
            calls[node.name] = set()
            for node2 in ast.walk(node):
                if isinstance(node2, ast.Call) and isinstance(node2.func, ast.Name):
                    calls[node.name].add(node2.func.id)
    return calls


def expand_functions(calls, functions):
    res = set()
    todo = set(functions)
    while todo:
        func = todo.pop()
        if func in calls:
            res.add(func)
            todo.update(calls[func])
    return list(res)


def get_functions(fn, functions):
    calls = get_function_call_dependency(fn)
    functions = expand_functions(calls, functions)
    
    env = runpy.run_path(fn)
    for func in functions:
        func_code = inspect.getsource(env[func])
        yield func_code
        
def callback(match, fn_py):
    utils_fn = path.join(path.dirname(fn_py), 'utils.py')
    indent, functions = match.groups()
    functions = [name.strip() for name in functions.split(',')]
    #TODO: parse utils.py to get function dependency
    return "\n\n".join(textwrap.indent(func, indent)
                       for func in get_functions(utils_fn, functions))

def replace_utils_re(code):
    return re.sub(r'^( *)from \.utils import (.+)',
           lambda match:callback(match, fn_py),
                     code, flags=re.MULTILINE)

def replace_utils_ast(fn_py, code):
    utils_fn = path.join(path.dirname(fn_py), 'utils.py')
    root = ast.parse(code)
    all_nodes = list(ast.walk(root))
    del_lines = set()
    to_insert = {}
    code_lines = code.split('\n')
    for i, node in enumerate(all_nodes):
        if isinstance(node, ast.ImportFrom) and node.module == 'utils':
            del_lines.update(range(node.lineno, all_nodes[i+1].lineno))
            functions = [o.name for o in node.names]
            functions_code = "\n".join(get_functions(utils_fn, functions))
            line = code_lines[node.lineno - 1]
            indent = len(line) - len(line.lstrip())
            to_insert[node.lineno] = textwrap.indent(functions_code, " " * indent)
    res = []
    for i, line in enumerate(code.split('\n'), 1):
        if i in to_insert:
            res.append(to_insert[i])
        if i not in del_lines:
            res.append(line)
    return "\n".join(res)
        
for fn_py in glob("*/*.py"):
    if fn_py.endswith("utils.py"):
        continue
    
    fn_js = fn_py.replace(".py", ".js")
    if True or not path.exists(fn_js) or os.stat(fn_js).st_mtime < os.stat(fn_py).st_mtime:
        print(fn_py)

        with open(fn_py) as f:
            code_py = f.read()

        code_py = replace_utils_ast(fn_py, code_py)
        code_js = py2js(code_py, inline_stdlib=True)

        with open(fn_js, "wb") as f:
            f.write((wrap_code % code_js).encode('utf-8'))
    
