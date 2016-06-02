def load_css(name):
    link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = require.toUrl(name)
    document.getElementsByTagName('head')[0].appendChild(link)

def unload_css(names):
    to_remove = []
    for el in document.getElementsByTagName('link').values():
        href = el.getAttribute('href')
        for name in names:
            if "scpy3" in href and name in href:
                to_remove.append(el)
                break
    for el in to_remove:
        el.parentNode.removeChild(el)

def T(tagname, *args):
    klass = None
    if '.' in tagname:
        tagname, klass = tagname.split('.')
    el = jQuery("<%s/>" % tagname)
    if klass is not None:
        el.addClass(klass)
    for child in args:
        el.append(child)
    return el

def is_head_cell(cell):
    return cell.cell_type == 'markdown' and cell.get_text().startswith('#')

def set_metadata(target, key, value):
    meta = target.metadata
    if 'scpy3' not in meta:
        meta.scpy3 = {}
    meta.scpy3[key] = value

def get_metadata(target, key):
    meta = target.metadata
    if 'scpy3' not in meta:
        return None
    if key not in meta.scpy3:
        return None
    return meta.scpy3[key]

def replace(src, pattern, target):
    """
    return String.prototype.replace.bind(src)(pattern, target)
    """

def get_level(cell):
    if cell.cell_type != "markdown":
        return 1000
    
    text = cell.get_text()
    if text.startswith("#"):
        level = len(text) - len(text.lstrip("#"))
        return level
    return 1000


def show_message(message, wait):
    notification_widget = Jupyter.notification_area.widget("notebook")            
    notification_widget.set_message(message, wait)

    
