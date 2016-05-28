import os
from os import path
from glob import glob
import re
import runpy
import inspect
import textwrap
from flexx.pyscript import py2js

wrap_code = """(function(){
%s
})()"""

def get_functions(fn, functions):
    global env
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

for fn_py in glob("*/*.py"):
    if fn_py.endswith("utils.py"):
        continue
    
    fn_js = fn_py.replace(".py", ".js")
    if not path.exists(fn_js) or os.stat(fn_js).st_mtime < os.stat(fn_py).st_mtime:
        print(fn_py)

        with open(fn_py) as f:
            code_py = f.read()

        code_py = re.sub(r'^( *)from \.utils import (.+)',
               lambda match:callback(match, fn_py),
                         code_py, flags=re.MULTILINE)

        code_js = py2js(code_py, inline_stdlib=True)

        with open(fn_js, "w") as f:
            f.write(wrap_code % code_js)
    
