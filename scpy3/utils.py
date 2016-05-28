def load_css(name):
    link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = require.toUrl(name)
    document.getElementsByTagName('head')[0].appendChild(link)

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
