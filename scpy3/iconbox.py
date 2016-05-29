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
        block = jQuery(cell.get_rendered())
        if block.prop('tagName') == 'BLOCKQUOTE':
            mark = block.find('p strong').text()
            if mark in block_types:
                node = cell.element.find('div.text_cell_render')
                content = node.find('p:not(:first)')
                blockquote = cell.element.find('blockquote')
                blockquote.addClass('icon_box')
                blockquote.html('<table class="icon_box"><tr><td class="first-column"></td><td></td></tr></table>')
                td_first = cell.element.find('td:first')
                td_first.html('<div class="fa large_font %s"></div>' % block_types[mark])
                cell.element.find('td:last').append(content)
                
    
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
            cell.events.trigger('rendered.MarkdownCell', {'cell': cell})

    return {"load_ipython_extension": main}

define(imports, load)
