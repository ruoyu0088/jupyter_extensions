from glob import glob
from flexx.pyscript import py2js

wrap_code = """(function(){
%s
})()"""

for fn_py in glob("*/*.py"):
    print(fn_py)
    fn_js = fn_py.replace(".py", ".js")
    with open(fn_py) as f:
        code_py = f.read()
        
    code_js = py2js(code_py, inline_stdlib=True)
  
    with open(fn_js, "w") as f:
        f.write(wrap_code % code_js)
    
