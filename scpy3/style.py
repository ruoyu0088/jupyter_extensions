imports = ['base/js/namespace', 'require']

def load(Jupyter, require):
    from .utils import load_css
    load_css('./style.css')
    
    def main():
        pass
    
    return {"load_ipython_extension": main}

define(imports, load)
