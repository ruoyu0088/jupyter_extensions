imports  = ['base/js/namespace', 'require']

block_types = { 'TIP': "fa-lightbulb-o",
                'WARNING': "fa-warning", 
                'LINK': "fa-link",
                'SOURCE': "fa-file-text",
                'QUESTION': "fa-question"}


def load(Jupyter, require):
    def format_block(cell, evt):
        cell = evt.cell
        if cell.cell_type != 'markdown':
            return
        el = cell.element
        output = el.find('div.text_cell_render')
        first_output = output.children()
        if first_output.prop('tagName') == 'BLOCKQUOTE':
            mark = first_output.find('p strong').text()
            console.log(mark)
            if mark == "" and first_output.attr('class') != 'icon_box':
                wrap = jQuery('<div/>').addClass('scpy3-info-box')
                wrap.html(cell.get_rendered())
                output.html(wrap)
            elif mark in block_types:
                content = output.find('p:not(:first)')
                first_output.addClass('icon_box')
                first_output.html('<table class="icon_box"><tr><td class="first-column"></td><td></td></tr></table>')
                td_first = first_output.find('td:first')
                td_first.html('<div class="fa large_font %s"></div>' % block_types[mark])
                first_output.find('td:last').append(content)
                
    
    def on_create_cell(notebook, evt):
        cell = evt.cell
        index = evt.index
        cell.events.on('rendered.MarkdownCell', format_block)

    def main():
        from .utils import load_css
        
        load_css('./iconbox.css')
        jQuery([Jupyter.events]).on('create.Cell', on_create_cell)
        for cell in Jupyter.notebook.get_cells():
            cell.events.on('rendered.MarkdownCell', format_block)
            format_block(cell, {'cell': cell})
            #cell.events.trigger('rendered.MarkdownCell', {'cell': cell})

    return {"load_ipython_extension": main}

define(imports, load)
